// Environment 9 -> imagen objetivo con índice 8 en targets.mind
export default {
  name: 'Environment 9',

  create(THREE) {
    const group = new THREE.Group();

    // Iluminación propia del environment
    group.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(1, 2, 2);
    group.add(dir);

    // Base circular sobre la imagen
    const base = new THREE.Mesh(
      new THREE.CircleGeometry(0.6, 48),
      new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.5 })
    );
    group.add(base);

    // Objeto principal
    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.2, 0.07, 100, 16),
      new THREE.MeshStandardMaterial({ color: 0xc77dff, metalness: 0.3, roughness: 0.4 })
    );
    mesh.position.z = 0.4; // flotando sobre la imagen
    group.add(mesh);

    return {
      group,
      mesh,
      update(dt, t) {
        mesh.rotation.y += dt;
        mesh.position.z = 0.4 + Math.sin(t * 2) * 0.05;
      },
    };
  },

  onFound(instance) {},
  onLost(instance) {},
};
