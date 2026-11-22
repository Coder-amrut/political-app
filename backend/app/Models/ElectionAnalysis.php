<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ElectionAnalysis extends Model
{
    use HasFactory;

    protected $table = 'election_analyses';

    protected $fillable = [
        'uuid',
        'election_type',
        'custom_election_name',
        'election_name',
        'election_year',
        'state',
        'district',
        'taluka',
        'city_or_village',
        'constituency',
        'total_registered_voters',
        'voting_percentage',
        'calculated_votes_polled',
        'previous_election_date',
        'previous_results',
        'additional_notes',
        'assembly_segments',
        'booth_count',
        'zp_gat_name',
        'ward_reservation',
        'parties',
        'other_candidates',
        'political_equations',
        'development_issues',
        'ground_observations',
        'swot_analysis',
        'status',
        'created_by',
    ];

    protected $casts = [
        'parties' => 'array',
        'other_candidates' => 'array',
        'development_issues' => 'array',
        'swot_analysis' => 'array',
        'total_registered_voters' => 'integer',
        'voting_percentage' => 'float',
        'calculated_votes_polled' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
