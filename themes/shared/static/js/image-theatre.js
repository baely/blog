(() => {
  const theatre = document.querySelector('.image-theatre');
  const expandedImage = theatre?.querySelector('img');
  const closeButton = theatre?.querySelector('.image-theatre__close');
  let opener = null;

  if (!theatre || !expandedImage || !closeButton) return;

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.image-theatre-trigger');
    if (!trigger) return;

    const image = trigger.querySelector('img');
    if (!image) return;

    opener = trigger;
    expandedImage.src = image.currentSrc || image.src;
    expandedImage.alt = image.alt;
    theatre.showModal();
  });

  closeButton.addEventListener('click', () => theatre.close());

  theatre.addEventListener('click', (event) => {
    if (event.target === theatre) theatre.close();
  });

  theatre.addEventListener('close', () => {
    expandedImage.removeAttribute('src');
    expandedImage.alt = '';
    opener?.focus();
    opener = null;
  });
})();
