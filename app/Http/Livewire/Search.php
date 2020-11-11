<?php

namespace App\Http\Livewire;

use App\Models\File;
use Livewire\Component;
use Livewire\WithPagination;

class Search extends Component
{
    use withPagination;

    public $searchTerm;

    public function updatingSearchTerm()
    {
        $this->resetPage();
    }

    public function render()
    {
        $files = File::where('path', 'LIKE', "%{$this->searchTerm}%")->paginate(50);
        return view('livewire.search', compact('files'));
    }
}
