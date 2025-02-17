document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.querySelector('.generate-btn');
    const promptInput = document.querySelector('.prompt-input');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const imageOutput = document.querySelector('.preview-placeholder');
    const previewImage = document.getElementById('preview-image');
    const skeletonLoader = document.getElementById('skeleton-loader');
    const placeholderText = document.getElementById('placeholder-text');
    const generatedImagesContainer = document.getElementById('generated-images');
    const resolutionBadge = document.getElementById('resolution-badge');
    const originalButtonText = generateButton.innerHTML;

    function updateResolutionBadge() {
        const widthValue = widthInput.value;
        const heightValue = heightInput.value;
        resolutionBadge.textContent = `${widthValue}x${heightValue}`;
    }

    updateResolutionBadge();

    widthInput.addEventListener('input', updateResolutionBadge);
    heightInput.addEventListener('input', updateResolutionBadge);

    generateButton.addEventListener('click', async () => {
        const promptText = promptInput.value;
        const widthValue = parseInt(widthInput.value);
        const heightValue = parseInt(heightInput.value);

        if (!promptText) {
            alert('Please enter a prompt.');
            return;
        }

        if (isNaN(widthValue) || widthValue < 100 || widthValue > 2048) {
            alert('Please enter a valid width between 100 and 2048.');
            return;
        }

        if (isNaN(heightValue) || heightValue < 100 || heightValue > 2048) {
            alert('Please enter a valid height between 100 and 2048.');
            return;
        }

        generateButton.innerHTML = 'Generating...';
        generateButton.disabled = true;

        //Show Skeleton Loading and Hide placeholder
        previewImage.style.display = 'none';
        imageOutput.classList.add('loading');
        skeletonLoader.style.display = 'flex';
        placeholderText.style.display = 'none'; // Hide "Enter prompt" text

        try {
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=${widthValue}&height=${heightValue}&seed=42&model=default`;

            const img = document.createElement('img');
            img.style.maxWidth = '100%';
            img.style.objectFit = 'contain';

            img.onload = () => {
                generateButton.innerHTML = originalButtonText;
                generateButton.disabled = false;

                imageOutput.classList.remove('loading');
                skeletonLoader.style.display = 'none';
                previewImage.src = imageUrl;
                previewImage.style.display = 'block';
                placeholderText.style.display = 'none'; // Ensure hidden on load
            };

            img.onerror = () => {
                console.error("Error loading image");
                alert("Error loading generated image.");
                generateButton.innerHTML = originalButtonText;
                generateButton.disabled = false;

                imageOutput.classList.remove('loading');
                skeletonLoader.style.display = 'none';
                previewImage.style.display = 'none';
                placeholderText.style.display = 'block'; // Show on error
            };

            img.src = imageUrl;
            img.alt = 'Generated Image';

            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.appendChild(img);
            generatedImagesContainer.appendChild(galleryItem);

        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
            generateButton.innerHTML = originalButtonText;
            generateButton.disabled = false;
            imageOutput.classList.remove('loading');
            skeletonLoader.style.display = 'none';
            previewImage.style.display = 'none';
            placeholderText.style.display = 'block'; // Show Enter prompt on error
        }
    });

     // Initially show "Enter prompt" text and hide skeleton
     placeholderText.style.display = 'block';
     skeletonLoader.style.display = 'none';

});