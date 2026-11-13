import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

const TARGET_COUNT = 10;
const TARGETS_FILE = './assets/targets.mind'; // compilado con las 10 imágenes

const overlay = document.getElementById('overlay');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('startBtn');

// Carga dinámica de Environment_1.js ... Environment_10.js
const modules = await Promise.all(
  Array.from({ length: TARGET_COUNT }, (_, i) =>
    import(`./environments/Environment_${i + 1}.js`)
  )
);

async function start() {
  const mindarThree = new MindARThree({
    container: document.getElementById('container'),
    imageTargetSrc: TARGETS_FILE,
    maxTrack: 1,
  });
  const { renderer, scene, camera } = mindarThree;

  const active = new Map(); // targetIndex -> { env, instance }

  modules.forEach((mod, i) => {
    const env = mod.default;
    const instance = env.create(THREE);
    instance.group.visible = false;

    const anchor = mindarThree.addAnchor(i); // i = índice de la imagen en targets.mind
    anchor.group.add(instance.group);

    anchor.onTargetFound = () => {
      instance.group.visible = true;
      active.set(i, { env, instance });
      statusEl.textContent = `Detectado: ${env.name}`;
      env.onFound?.(instance);
    };
    anchor.onTargetLost = () => {
      instance.group.visible = false;
      active.delete(i);
      statusEl.textContent = 'Buscando imagen...';
      env.onLost?.(instance);
    };
  });

  await mindarThree.start();
  overlay.classList.add('hidden');
  statusEl.hidden = false;

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    const t = clock.elapsedTime;
    active.forEach(({ instance }) => instance.update?.(dt, t));
    renderer.render(scene, camera);
  });
}

startBtn.addEventListener('click', () => {
  start().catch((err) => {
    console.error(err);
    alert('No se pudo iniciar la cámara o cargar targets.mind:\n' + err.message);
  });
});
