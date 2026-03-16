<script>
(function() {
    window.onload = function() {
        const stlInput = document.getElementById('stl-input');
        const volDisplay = document.getElementById('volume');
        const priceDisplay = document.getElementById('price');
        const resultArea = document.getElementById('result-area');

        if (!stlInput) return;

        stlInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = function(event) {
                try {
                    if (typeof THREE === 'undefined') {
                        alert("Error: Librería Three.js no cargada.");
                        return;
                    }

                    const loader = new THREE.STLLoader();
                    const geometry = loader.parse(event.target.result);
                    let volume = 0;
                    const pos = geometry.attributes.position.array;

                    for (let i = 0; i < pos.length; i += 9) {
                        let v1 = new THREE.Vector3(pos[i], pos[i+1], pos[i+2]);
                        let v2 = new THREE.Vector3(pos[i+3], pos[i+4], pos[i+5]);
                        let v3 = new THREE.Vector3(pos[i+6], pos[i+7], pos[i+8]);
                        volume += (v1.dot(v2.cross(v3))) / 6;
                    }

                    const finalVol = Math.abs(volume) / 1000;
                    const finalPrice = finalVol * 500;

                    volDisplay.innerText = finalVol.toFixed(2);
                    priceDisplay.innerText = "$" + Math.round(finalPrice).toLocaleString('es-CL');
                    resultArea.style.display = 'block';

                } catch (err) {
                    alert("Error al procesar el archivo STL.");
                }
            };
        });
    };
})();
</script>