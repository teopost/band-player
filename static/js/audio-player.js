document.addEventListener('DOMContentLoaded', () => {
    let currentAudio = null; // Tiene traccia dell'audio in riproduzione
    let currentHighlightedItem = null;
    let currentFolder = document.querySelector('.btn-active')?.dataset.folder || '';

    const header = document.querySelector('.header-container');
    const buttonsContainer = document.querySelector('.folder-buttons-container');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100 && currentScroll > lastScroll) {
            header.style.transform = `translateY(-${header.offsetHeight}px)`;
            buttonsContainer.style.top = "0";
            document.body.classList.add('scrolled');
        } else {
            header.style.transform = "translateY(0)";
            buttonsContainer.style.top = `${header.offsetHeight}px`;
            document.body.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    const updateAudioList = (folder) => {
        fetch(`/load-audio?folder=${encodeURIComponent(folder)}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById('audio-list');

                if (newContent) {
                    document.getElementById('audio-list').innerHTML = newContent.innerHTML;
                    document.getElementById('selected-folder').textContent = `Cartella selezionata: ${folder}`;
                    currentFolder = folder;
                    attachAudioHandlers();
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handlePlay = (e) => {
        if (currentAudio && currentAudio !== e.target) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (currentHighlightedItem) {
            currentHighlightedItem.classList.remove('playing');
        }
        currentHighlightedItem = e.target.closest('.list-group-item');
        currentHighlightedItem.classList.add('playing');

        currentAudio = e.target;
    };

    const handleEnded = (e) => {
        const currentItem = e.target.closest('.list-group-item');
        currentItem.classList.remove('playing');

        // Trova il prossimo brano nella lista
        const nextItem = currentItem.nextElementSibling;
        if (nextItem && nextItem.querySelector('audio')) {
            const nextAudio = nextItem.querySelector('audio');
            nextItem.classList.add('playing');
            nextAudio.play();
            currentAudio = nextAudio;
            currentHighlightedItem = nextItem;
        } else {
            currentAudio = null;
        }
    };

    const attachAudioHandlers = () => {
        document.querySelectorAll('audio').forEach(audio => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('ended', handleEnded);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('ended', handleEnded);
        });
    };

    document.querySelectorAll('[data-folder]').forEach(button => {
        button.addEventListener('click', (e) => {
            const newFolder = e.target.dataset.folder;
            if (newFolder !== currentFolder) {
                document.querySelectorAll('[data-folder]').forEach(btn => btn.classList.remove('btn-active'));
                e.target.classList.add('btn-active');
                if (currentHighlightedItem) currentHighlightedItem.classList.remove('playing');
                updateAudioList(newFolder);
            }
        });
    });

    attachAudioHandlers();
    document.getElementById('selected-folder').textContent = `Cartella selezionata: ${currentFolder}`;
    buttonsContainer.style.top = `${header.offsetHeight}px`;
});
