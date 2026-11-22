<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectionAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ElectionAnalysisController extends Controller
{
    /**
     * Display a listing of all analyzed elections.
     */
    public function index(Request $request)
    {
        $query = ElectionAnalysis::query();

        if ($request->filled('election_type')) {
            $query->where('election_type', $request->election_type);
        }

        if ($request->filled('district')) {
            $query->where('district', 'like', '%' . $request->district . '%');
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('election_name', 'like', "%{$search}%")
                  ->orWhere('constituency', 'like', "%{$search}%")
                  ->orWhere('district', 'like', "%{$search}%")
                  ->orWhere('city_or_village', 'like', "%{$search}%");
            });
        }

        $analyses = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'count' => $analyses->count(),
            'data' => $analyses,
        ]);
    }

    /**
     * Store a newly created or updated election analysis.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'election_name' => 'required|string|max:255',
            'election_type' => 'nullable|string|max:100',
            'custom_election_name' => 'nullable|string|max:255',
            'election_year' => 'nullable|string|max:10',
            'state' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'taluka' => 'nullable|string|max:100',
            'city_or_village' => 'nullable|string|max:255',
            'constituency' => 'nullable|string|max:255',
            'total_registered_voters' => 'nullable|numeric',
            'voting_percentage' => 'nullable|numeric',
            'calculated_votes_polled' => 'nullable|numeric',
            'previous_election_date' => 'nullable|string|max:100',
            'previous_results' => 'nullable|string',
            'additional_notes' => 'nullable|string',
            'assembly_segments' => 'nullable|string',
            'booth_count' => 'nullable|string|max:50',
            'zp_gat_name' => 'nullable|string|max:150',
            'ward_reservation' => 'nullable|string|max:150',
            'parties' => 'nullable',
            'other_candidates' => 'nullable',
            'political_equations' => 'nullable|string',
            'development_issues' => 'nullable',
            'ground_observations' => 'nullable|string',
            'swot_analysis' => 'nullable',
            'status' => 'nullable|string|max:50',
        ]);

        $userId = Auth::id() ?? 1;

        // Auto-calculate votes polled if not directly supplied
        $voters = (int) ($validated['total_registered_voters'] ?? 0);
        $turnout = (float) ($validated['voting_percentage'] ?? 0);
        $votesPolled = (int) ($validated['calculated_votes_polled'] ?? 0);
        if ($votesPolled === 0 && $voters > 0 && $turnout > 0) {
            $votesPolled = (int) round(($voters * $turnout) / 100);
        }

        $analysis = ElectionAnalysis::create([
            'uuid' => (string) Str::uuid(),
            'election_type' => $validated['election_type'] ?? 'vidhan_sabha',
            'custom_election_name' => $validated['custom_election_name'] ?? null,
            'election_name' => $validated['election_name'],
            'election_year' => $validated['election_year'] ?? date('Y'),
            'state' => $validated['state'] ?? 'महाराष्ट्र',
            'district' => $validated['district'] ?? null,
            'taluka' => $validated['taluka'] ?? null,
            'city_or_village' => $validated['city_or_village'] ?? null,
            'constituency' => $validated['constituency'] ?? null,
            'total_registered_voters' => $voters,
            'voting_percentage' => $turnout,
            'calculated_votes_polled' => $votesPolled,
            'previous_election_date' => $validated['previous_election_date'] ?? null,
            'previous_results' => $validated['previous_results'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
            'assembly_segments' => $validated['assembly_segments'] ?? null,
            'booth_count' => $validated['booth_count'] ?? null,
            'zp_gat_name' => $validated['zp_gat_name'] ?? null,
            'ward_reservation' => $validated['ward_reservation'] ?? null,
            'parties' => is_array($request->input('parties')) ? $request->input('parties') : json_decode($request->input('parties') ?? '[]', true),
            'other_candidates' => is_array($request->input('other_candidates')) ? $request->input('other_candidates') : json_decode($request->input('other_candidates') ?? '[]', true),
            'political_equations' => $validated['political_equations'] ?? null,
            'development_issues' => is_array($request->input('development_issues')) ? $request->input('development_issues') : json_decode($request->input('development_issues') ?? '[]', true),
            'ground_observations' => $validated['ground_observations'] ?? null,
            'swot_analysis' => is_array($request->input('swot_analysis')) ? $request->input('swot_analysis') : json_decode($request->input('swot_analysis') ?? '[]', true),
            'status' => $validated['status'] ?? 'completed',
            'created_by' => $userId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'निवडणूक विश्लेषण यशस्वीरीत्या डेटाबेसमध्ये सेव्ह झाले!',
            'data' => $analysis,
        ], 201);
    }

    /**
     * Display the specified election analysis.
     */
    public function show($idOrUuid)
    {
        $analysis = is_numeric($idOrUuid)
            ? ElectionAnalysis::find($idOrUuid)
            : ElectionAnalysis::where('uuid', $idOrUuid)->first();

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'निवडणूक विश्लेषण डेटा आढळला नाही.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $analysis,
        ]);
    }

    /**
     * Update the specified election analysis in storage.
     */
    public function update(Request $request, $idOrUuid)
    {
        $analysis = is_numeric($idOrUuid)
            ? ElectionAnalysis::find($idOrUuid)
            : ElectionAnalysis::where('uuid', $idOrUuid)->first();

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'निवडणूक विश्लेषण डेटा आढळला नाही.',
            ], 404);
        }

        $input = $request->all();

        // Process arrays
        if (isset($input['parties']) && !is_array($input['parties'])) {
            $input['parties'] = json_decode($input['parties'], true);
        }
        if (isset($input['other_candidates']) && !is_array($input['other_candidates'])) {
            $input['other_candidates'] = json_decode($input['other_candidates'], true);
        }
        if (isset($input['development_issues']) && !is_array($input['development_issues'])) {
            $input['development_issues'] = json_decode($input['development_issues'], true);
        }
        if (isset($input['swot_analysis']) && !is_array($input['swot_analysis'])) {
            $input['swot_analysis'] = json_decode($input['swot_analysis'], true);
        }

        $analysis->update($input);

        return response()->json([
            'success' => true,
            'message' => 'निवडणूक विश्लेषण यशस्वीरीत्या अद्ययावत (Update) झाले!',
            'data' => $analysis->fresh(),
        ]);
    }

    /**
     * Remove the specified election analysis from storage.
     */
    public function destroy($idOrUuid)
    {
        $analysis = is_numeric($idOrUuid)
            ? ElectionAnalysis::find($idOrUuid)
            : ElectionAnalysis::where('uuid', $idOrUuid)->first();

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'निवडणूक विश्लेषण डेटा आढळला नाही.',
            ], 404);
        }

        $analysis->delete();

        return response()->json([
            'success' => true,
            'message' => 'निवडणूक विश्लेषण यशस्वीरीत्या हटवले (Deleted)!',
        ]);
    }
}
