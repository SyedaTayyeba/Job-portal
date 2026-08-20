<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Job extends Model
{
   protected $table = 'job_posts';
   protected $fillable = [
    'company_id',
    'title',
    'description',
    'salary',
    'location',
    'status'
   ];
   public function company(){
    return $this->belongsTo(Company::class);

   }
   public function applications(){
    return $this->hasMany(Application::class);
   }
}
