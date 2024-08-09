<x-app-layout title="{{ $page_meta['title'] }}">
    <x-slot name="slot">

        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-geosearch/dist/geosearch.css" />

        <style>
            /* Menyembunyikan spinners pada input type number di semua browser */
            input[type="number"] {
                -moz-appearance: textfield; /* Firefox */
            }
            input[type="number"]::-webkit-inner-spin-button,
            input[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none; /* Safari dan Chrome */
                margin: 0;
            }
            #map {
                height: 400px;
                width: 100%;
                margin: 0;  
                padding: 0; 
                z-index: 1;
            }
        </style>

        <div class="col-12 py-3">
            <h1 class="title mb-1">{{ $page_meta['header'] }}</h1>
            <span>{{ $page_meta['description'] }}</span>
        </div>
        
        <div class="col-12 bg-white rounded p-2 px-3 shadow-sm">

            <x-validasi.validasi></x-validasi.validasi>

            <div class="col-12 mt-2 mb-3">
                <div id="map"></div>
            </div>
            
            <form action="{{ $page_meta['url'] }}" method="POST" id="form-cabang-perusahaan">
                @method($page_meta['method'])
                @csrf

                <div class="cabangPerusahaan col-12 mb-3">
                    <label for="cabangPerusahaan">Nama Cabang</label>
                    <input type="text" name="nama_cabang" id="cabangPerusahaan" class="form-control @error('nama_cabang') is-invalid @enderror" autocomplete="off" value="{{ old('nama_cabang', $cabangperusahaan->nama_cabang) }}">
                    @error('nama_cabang')
                        <div class="invalid-feedback d-block">
                            {{ $message }}
                        </div> 
                    @enderror
                </div>

                <div class="col-12 mb-3">
                    <div class="d-block">
                        <label for="latitude">Latitude</label>
                        <input type="text" name="latitude" id="latitude" class="form-control" value="{{ old('latitude', $cabangperusahaan->latitude) }}">
                    </div>
                </div>

                <div class="col-12">
                    <label for="longitude">Longitude</label>
                    <input type="text" name="longitude" id="longitude" class="form-control" value="{{ old('longitude', $cabangperusahaan->longitude) }}">
                </div>

                <div class="col-12">
                    <label for="radius">Radius dalam meter</label>
                    <input type="number" name="radius" id="radius" class="form-control" min="0" value="{{ old('radius', $cabangperusahaan->radius) }}">
                </div>
    
                <div class="alamatCabang">
                    <label for="alamatCabang">Alamat Cabang</label>
                    <textarea name="alamat_cabang" id="alamatCabang" class="form-control @error('alamat_cabang') is-invalid @enderror" autocomplete="off" style="min-height:100px; max-height:100px;">{{ old('alamat_cabang', $cabangperusahaan->alamat_cabang) }}</textarea>
                    @error('alamat_cabang')
                        <div class="invalid-feedback d-block">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
    
                <div class="tombolTambah mt-4 d-flex flex-wrap justify-content-end">
                    <button type="reset" id="resetButton" class="btn btn-danger">Reset</button>
                    <button type="button" class="btn btn-primary ms-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        {{ $page_meta['btntext'] }}
                    </button>
                </div>
        
                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel"><b>Perhatian !</b></h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                {!! $page_meta['warning'] !!}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Tutup</button>
                                <button type="submit" class="btn btn-success">Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            <script src="https://unpkg.com/leaflet-geosearch/dist/geosearch.umd.js"></script>

            <script src="{{ asset('js/formCabangPerusahaan.js') }}"></script>

        </div>
    </x-slot>
</x-app-layout>
