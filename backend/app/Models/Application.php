<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
   public function user(){
    return $this->belongsTo(User::class);
   }
   public function job(){
    return $this->belongsTo(Job::class);
   }
}
