<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RegistrationSource;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateUserRequest;
use App\Http\Requests\Admin\RejectUserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    // -------------------------------------------------------------------------
    // GET /api/admin/users — User Management Hub
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $allUsers = User::with('roles')->orderBy('created_at', 'desc')->get();

        $appUsersCount = $allUsers->filter(fn ($u) => $u->roles->contains('name', 'WORKER'))->count();
        $appAdminCount = $allUsers->filter(fn ($u) => $u->roles->contains('name', 'OFFICER'))->count();
        $webAdminCount = $allUsers->filter(fn ($u) => $u->roles->contains('name', 'ADMIN'))->count();
        $pendingCount  = $allUsers->where('status', UserStatus::PENDING->value)->count();

        $query = User::with('roles')->orderBy('created_at', 'desc');

        if ($request->filled('q')) {
            $q = trim((string) $request->input('q'));
            $query->where(function ($sub) use ($q) {
                $sub->where('full_name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('role') && $request->input('role') !== 'all') {
            $targetRole = $request->input('role');
            $query->whereHas('roles', function ($sub) use ($targetRole) {
                $sub->where('name', $targetRole);
            });
        }

        if ($request->filled('system') && $request->input('system') !== 'all') {
            $system = $request->input('system');
            if ($system === 'app_worker') {
                $query->whereHas('roles', fn ($sub) => $sub->where('name', 'WORKER'));
            } elseif ($system === 'app_admin') {
                $query->whereHas('roles', fn ($sub) => $sub->where('name', 'OFFICER'));
            } elseif ($system === 'web_admin') {
                $query->whereHas('roles', fn ($sub) => $sub->where('name', 'ADMIN'));
            }
        }

        $users = $query->get()->map(fn (User $u) => $this->safeUser($u));

        return response()->json([
            'status' => 'success',
            'counts' => [
                'total'         => $allUsers->count(),
                'app_users'     => $appUsersCount,
                'app_admin'     => $appAdminCount,
                'website_admin' => $webAdminCount,
                'pending'       => $pendingCount,
            ],
            'data'   => $users,
        ]);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/users/{id}/role — Update User Role
    // -------------------------------------------------------------------------

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $roleNames = (array) ($request->input('roles') ?: [$request->input('role')]);
        $roleNames = array_filter($roleNames);

        if (empty($roleNames)) {
            return response()->json(['message' => 'किमान एक भूमिका (Role) निवडणे आवश्यक आहे.'], 422);
        }

        $roles = Role::whereIn('name', $roleNames)->get();
        if ($roles->isEmpty()) {
            return response()->json(['message' => 'निवडलेली भूमिका अस्तित्वात नाही.'], 422);
        }

        $user->roles()->sync($roles->pluck('id')->toArray());
        $user->load('roles');

        return response()->json([
            'status'  => 'success',
            'message' => 'वापरकर्त्याची भूमिका यशस्वीरीत्या बदलली.',
            'user'    => $this->safeUser($user),
        ]);
    }

    // -------------------------------------------------------------------------
    // PUT /api/admin/users/{id}/status — Update User Status (Block / Unblock / Activate / Suspend)
    // -------------------------------------------------------------------------

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $status = strtoupper(trim((string) $request->input('status')));

        if (!in_array($status, ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'REJECTED'], true)) {
            return response()->json(['message' => 'अवैध स्थिती मूल्य.'], 422);
        }

        $user->update(['status' => $status]);
        $user->load('roles');

        $statusMsg = $status === 'SUSPENDED' 
            ? "वापरकर्ता '{$user->full_name}' यशस्वीरीत्या ब्लॉक / निलंबित करण्यात आला." 
            : ($status === 'ACTIVE' 
                ? "वापरकर्ता '{$user->full_name}' यशस्वीरीत्या सक्रिय / अनब्लॉक करण्यात आला." 
                : "वापरकर्त्याची स्थिती '{$status}' करण्यात आली.");

        return response()->json([
            'status'  => 'success',
            'message' => $statusMsg,
            'user'    => $this->safeUser($user),
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/users/{id}/reset-password — Reset User Password
    // -------------------------------------------------------------------------

    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $newPassword = $request->input('password');

        if (!$newPassword || strlen($newPassword) < 6) {
            return response()->json(['message' => 'पासवर्ड किमान ६ अक्षरांचा असावा.'], 422);
        }

        $user->update([
            'password_hash' => Hash::make($newPassword),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => "वापरकर्ता {$user->full_name} चा पासवर्ड यशस्वीरीत्या बदलण्यात आला.",
        ]);
    }

    // -------------------------------------------------------------------------
    // DELETE /api/admin/users/{id} — Delete User
    // -------------------------------------------------------------------------

    public function destroy(Request $request, int $id): JsonResponse
    {
        $currentAdmin = $request->user();
        if ($currentAdmin && (int)$currentAdmin->id === (int)$id) {
            return response()->json(['message' => 'तुम्ही स्वतःचे खाते हटवू शकत नाही.'], 422);
        }

        $user = User::findOrFail($id);
        $userName = $user->full_name;
        $user->roles()->detach();
        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => "वापरकर्ता '{$userName}' यशस्वीरीत्या हटवण्यात आला.",
        ]);
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/users/pending
    // -------------------------------------------------------------------------

    public function pending(Request $request): JsonResponse
    {
        $users = User::with('roles')
            ->where('status', UserStatus::PENDING->value)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn (User $u) => $this->safeUser($u));

        return response()->json([
            'data'  => $users,
            'total' => $users->count(),
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/users/{id}/approve
    // -------------------------------------------------------------------------

    public function approve(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->status !== UserStatus::PENDING->value) {
            return response()->json([
                'message' => 'Only PENDING accounts can be approved.',
            ], 409);
        }

        $admin = $request->user();

        \DB::beginTransaction();
        try {
            $user->update([
                'status'           => UserStatus::ACTIVE->value,
                'approved_by'      => $admin->id,
                'approved_at'      => now(),
                'rejection_reason' => null,
            ]);

            AuditService::log(
                action:     'USER_APPROVED',
                userId:     $admin->id,
                entityType: 'users',
                entityId:   (string) $user->id,
                oldData:    ['status' => UserStatus::PENDING->value],
                newData:    ['status' => UserStatus::ACTIVE->value, 'approved_by' => $admin->id],
                request:    $request,
            );

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            throw $e;
        }

        $user->load('roles');

        return response()->json([
            'message' => 'User approved successfully.',
            'user'    => $this->safeUser($user),
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/users/{id}/reject
    // -------------------------------------------------------------------------

    public function reject(RejectUserRequest $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->status !== UserStatus::PENDING->value) {
            return response()->json([
                'message' => 'Only PENDING accounts can be rejected.',
            ], 409);
        }

        $admin = $request->user();

        \DB::beginTransaction();
        try {
            $user->update([
                'status'           => UserStatus::REJECTED->value,
                'approved_by'      => null,
                'approved_at'      => null,
                'rejection_reason' => $request->validated()['rejection_reason'],
            ]);

            AuditService::log(
                action:     'USER_REJECTED',
                userId:     $admin->id,
                entityType: 'users',
                entityId:   (string) $user->id,
                oldData:    ['status' => UserStatus::PENDING->value],
                newData:    [
                    'status'           => UserStatus::REJECTED->value,
                    'rejection_reason' => $request->validated()['rejection_reason'],
                ],
                request:    $request,
            );

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            throw $e;
        }

        $user->load('roles');

        return response()->json([
            'message' => 'User rejected.',
            'user'    => $this->safeUser($user),
        ]);
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/users
    // -------------------------------------------------------------------------

    public function store(CreateUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $role = Role::where('name', $validated['role'])->first();

        if (! $role) {
            return response()->json([
                'message' => 'The requested role does not exist.',
            ], 422);
        }

        $admin = $request->user();

        \DB::beginTransaction();
        try {
            $user = User::create([
                'uuid'                => (string) Str::uuid(),
                'full_name'           => $validated['full_name'],
                'email'               => $validated['email'] ?? null,
                'phone'               => $validated['phone'],
                'password_hash'       => Hash::make($validated['password']),
                'status'              => UserStatus::ACTIVE->value,
                'registration_source' => RegistrationSource::ADMIN_CREATED->value,
                'approved_by'         => $admin->id,
                'approved_at'         => now(),
            ]);

            $user->roles()->syncWithoutDetaching([$role->id]);

            AuditService::log(
                action:     'ADMIN_CREATED_USER',
                userId:     $admin->id,
                entityType: 'users',
                entityId:   (string) $user->id,
                newData:    [
                    'full_name' => $user->full_name,
                    'role'      => $validated['role'],
                    'status'    => UserStatus::ACTIVE->value,
                ],
                request:    $request,
            );

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            throw $e;
        }

        $user->load('roles');

        return response()->json([
            'message' => 'User created successfully.',
            'user'    => $this->safeUser($user),
        ], 201);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Return safe user data — never includes password_hash.
     */
    private function safeUser(User $user): array
    {
        return [
            'id'                  => $user->id,
            'uuid'                => $user->uuid,
            'full_name'           => $user->full_name,
            'email'               => $user->email,
            'phone'               => $user->phone,
            'status'              => $user->status,
            'registration_source' => $user->registration_source,
            'approved_by'         => $user->approved_by,
            'approved_at'         => $user->approved_at?->toISOString(),
            'rejection_reason'    => $user->rejection_reason,
            'created_at'          => $user->created_at?->toISOString(),
            'roles'               => $user->roles->pluck('name'),
        ];
    }
}
