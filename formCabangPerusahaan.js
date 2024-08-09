window.onload = function () {
    // Simpan data form yang sudah ada ke local storage pada saat halaman dimuat
    saveInitialFormData();

    // Inisialisasi peta dan komponen-komponennya
    initializeMap();
};

window.onbeforeunload = function () {
    // Hapus semua data dari local storage saat pengguna berpindah halaman
    clearLocalStorage();
};

function restoreFormData() {
    document
        .querySelectorAll(
            "#form-cabang-perusahaan input, #form-cabang-perusahaan textarea"
        )
        .forEach(function (element) {
            const savedValue = localStorage.getItem(element.id);
            if (savedValue) {
                element.value = savedValue;
            } else {
                // Jika tidak ada data di local storage, set default value
                if (element.id === "latitude") element.value = "";
                if (element.id === "longitude") element.value = "";
                if (element.id === "radius") element.value = "";
                if (element.id === "alamatCabang") element.value = "";
            }
        });
}

function saveInitialFormData() {
    document
        .querySelectorAll(
            "#form-cabang-perusahaan input, #form-cabang-perusahaan textarea"
        )
        .forEach(function (element) {
            if (!localStorage.getItem(element.id)) {
                localStorage.setItem(element.id, element.value);
            }
        });
}

function clearLocalStorage() {
    document
        .querySelectorAll(
            "#form-cabang-perusahaan input, #form-cabang-perusahaan textarea"
        )
        .forEach(function (element) {
            localStorage.removeItem(element.id);
        });
}

function initializeMap() {
    // Koordinat yang ditentukan
    const defaultCoords = [-6.243560320953855, 106.92026212381941]; // Default coordinates

    // Ambil nilai dari form jika ada atau dari local storage
    const latInput = document.getElementById("latitude").value;
    const lngInput = document.getElementById("longitude").value;
    const radiusInput = document.getElementById("radius").value;

    const initialLatLng =
        latInput && lngInput
            ? [parseFloat(latInput), parseFloat(lngInput)]
            : defaultCoords;
    const initialRadius = radiusInput ? parseFloat(radiusInput) : 0;

    const map = L.map("map").setView(initialLatLng, 19);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(initialLatLng, { draggable: true }).addTo(map);
    let circle = L.circle(initialLatLng, {
        radius: initialRadius,
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.2,
    }).addTo(map);

    function updateCircle(latLng, radius = initialRadius) {
        circle.setLatLng(latLng);
        circle.setRadius(radius);
    }

    updateCircle(initialLatLng, initialRadius);

    marker.on("moveend", function (e) {
        const latLng = e.target.getLatLng();
        document.getElementById("latitude").value = latLng.lat;
        document.getElementById("longitude").value = latLng.lng;

        fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`
        )
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("alamatCabang").value =
                    data.display_name || "Alamat tidak ditemukan";
            });

        updateCircle(latLng);
    });

    document.getElementById("radius").addEventListener("input", function () {
        const latLng = marker.getLatLng();
        const radius = parseFloat(this.value) || 0;
        updateCircle(latLng, radius);
    });

    map.on("click", function (e) {
        const latLng = e.latlng;
        marker.setLatLng(latLng);

        document.getElementById("latitude").value = latLng.lat;
        document.getElementById("longitude").value = latLng.lng;

        fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`
        )
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("alamatCabang").value =
                    data.display_name || "Alamat tidak ditemukan";
            });

        updateCircle(latLng);
    });

    const searchControl = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),
        style: "bar",
        searchLabel: "Cari Lokasi",
        autoClose: true,
    });
    map.addControl(searchControl);

    document
        .getElementById("resetButton")
        .addEventListener("click", function (e) {
            e.preventDefault();

            // Mengembalikan nilai form dari local storage
            restoreFormData();

            // Setelah restore form, update posisi marker dan lingkaran sesuai nilai form yang baru dipulihkan
            const lat =
                parseFloat(document.getElementById("latitude").value) ||
                defaultCoords[0];
            const lng =
                parseFloat(document.getElementById("longitude").value) ||
                defaultCoords[1];
            const radius =
                parseFloat(document.getElementById("radius").value) || 0;
            const newLatLng = [lat, lng];

            marker.setLatLng(newLatLng);
            updateCircle(newLatLng, radius);
            map.setView(newLatLng, 19);
        });
}
