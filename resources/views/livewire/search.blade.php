<div>
    <div class="p-4 bg-gray-400">
        <input type="text" id="search" wire:model="searchTerm"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username" type="text" placeholder="Search" />
    </div>
    <div class="p-4">
        <div class="pb-2">{{ $files->links() }}</div>

        <ul class="py-5">
            @foreach ($files as $file)
                <li class="w-full p-3 bg-white border-b-1 border-gray-4s00 mb-1">{{ $file->path }}</li>
            @endforeach
        </ul>
    </div>
</div>
