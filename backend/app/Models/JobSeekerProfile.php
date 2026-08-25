<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class JobSeekerProfile extends Model
{
    use HasFactory;

    protected $table = 'job_seeker_profiles';

    protected $fillable = [
        'user_id',
        'phone',
        'location',
        'bio',
        'skills',
        'education',
        'experience',
        'resume',
    ];

    protected $casts = [
        'user_id' => 'integer',
    ];

    /**
     * Profile belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}