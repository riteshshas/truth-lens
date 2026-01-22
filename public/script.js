document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const textTab = document.getElementById('textTab');
    const imageTab = document.getElementById('imageTab');
    const textMode = document.getElementById('textMode');
    const imageMode = document.getElementById('imageMode');
    const textInputEl = document.getElementById('textInput');
    const imageInput = document.getElementById('imageInput');
    const dropZone = document.getElementById('dropZone');
    const dropContent = document.getElementById('dropContent');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const fileName = document.getElementById('fileName');
    const textResult = document.getElementById('textResult');
    const imageResult = document.getElementById('imageResult');
    const checkTextBtn = document.getElementById('checkTextBtn');
    const checkImageBtn = document.getElementById('checkImageBtn');
    const exampleTextBtn = document.getElementById('exampleTextBtn');
    const exampleImageBtn = document.getElementById('exampleImageBtn');
    const startVerifyingBtn = document.getElementById('startVerifyingBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Toggle menu open/close
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    let loading = false;

    // Helper function for loading state
    function setLoading(isLoading, type) {
        loading = isLoading;
        const btn = type === 'text' ? checkTextBtn : checkImageBtn;
        const btnText = type === 'text' ? document.getElementById('textBtnText') : document.getElementById('imageBtnText');
        const spinner = type === 'text' ? document.getElementById('textSpinner') : document.getElementById('imageSpinner');

        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    // Function to handle text verification
    // Function to handle text verification
   const CHECK_TEXT_ENABLED = false;

async function handleCheckText() {
    if (!CHECK_TEXT_ENABLED) {
        alert('This feature is temporarily disabled.');
        return;
    }

    if (loading) return;

    const text = textInputEl.value.trim();
    if (!text) {
        alert('Please enter some text to analyze!');
        return;
    }

        setLoading(true, 'text');
        textResult.innerHTML = '<div class="text-center text-gray-500 py-8"><div class="spinner mx-auto"></div><p class="mt-2">Fact-checking against global knowledge base...</p></div>';

        try {
            const response = await fetch('/api/verify-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();

            if (response.ok) {
                const score = data.authenticity_score;
                
                // Color Logic
                let scoreColor, scoreLabel;
                if (score > 80) {
                    scoreColor = 'text-green-600';
                    scoreLabel = 'Highly Reliable';
                } else if (score < 50) {
                    scoreColor = 'text-red-600';
                    scoreLabel = 'Unreliable / Fake';
                } else {
                    scoreColor = 'text-yellow-600';
                    scoreLabel = 'Mixed Accuracy';
                }

                const verdictIcon = score > 50 ? '✅' : '⚠️';
                const bgColor = score < 50 ? 'bg-red-50' : (score > 80 ? 'bg-green-50' : 'bg-yellow-50');
                const borderColor = score < 50 ? 'border-red-200' : (score > 80 ? 'border-green-200' : 'border-yellow-200');

                // Generate bullet points for claims
                const claimsHtml = data.main_claims ? 
                    `<div class="mt-3"><h6 class="font-bold text-gray-700 text-sm">Key Claims Analyzed:</h6><ul class="list-disc list-inside text-sm text-gray-600 mt-1">${data.main_claims.map(c => `<li>${c}</li>`).join('')}</ul></div>` : '';

                textResult.innerHTML = `
                    <div class="${bgColor} border ${borderColor} rounded-xl p-6 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-xl font-bold text-gray-900 flex items-center">
                                <span class="mr-2">${verdictIcon}</span> ${data.verdict}
                            </h4>
                            <div class="text-right">
                                <span class="block font-bold ${scoreColor} text-2xl">
                                    ${score}/100
                                </span>
                                <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                    ${scoreLabel}
                                </span>
                            </div>
                        </div>
                        
                        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h5 class="font-bold text-gray-800 mb-2">Fact Check Analysis:</h5>
                            <p class="text-gray-700 leading-relaxed">${data.reasoning}</p>
                            ${claimsHtml}
                        </div>
                        
                        <div class="mt-4 text-xs text-gray-500 text-center">
                            Verified by Truth Lens AI 
                        </div>
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Analysis failed.');
            }
        } catch (error) {
            textResult.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 class="text-red-800 font-bold mb-2">❌ Error</h4>
                    <p class="text-red-700">${error.message || 'Failed to connect to the server.'}</p>
                </div>
            `;
        } finally {
            setLoading(false, 'text');
        }
    }
    // Function to handle image verification
const CHECK_IMAGE_ENABLED = false;

async function handleCheckImage() {
    if (!CHECK_IMAGE_ENABLED) {
        alert('This feature is temporarily disabled.');
        return;
    }

    if (loading) return;

    const imageFile = document.getElementById('imageInput').files[0];
    if (!imageFile) {
        alert('Please select an image to analyze!');
        return;
    }

    // rest of your image logic
}

    setLoading(true, 'image');
    // Using your existing spinner logic
    imageResult.innerHTML = '<div class="text-center text-gray-500 py-8"><div class="spinner mx-auto"></div><p class="mt-2">Sending to Truthlens for forensic analysis...</p></div>';

    try {
        // DIRECT BINARY UPLOAD - No URLs, no "Step 2"
        const formData = new FormData();
        formData.append('image', imageFile); // This key 'image' must match the backend upload.single('image')

        // Send directly to the verification endpoint
        // I am assuming your backend router is mounted at /api/verify-image
        const response = await fetch('/api/verify-image', {
            method: 'POST',
            body: formData // Fetch automatically sets the Content-Type to multipart/form-data
        });

        const data = await response.json();

        if (response.ok) {
            const score = data.authenticity_score;
            const isSuspicious = data.is_suspicious;
            
            // Logic: High Score (90+) = Green, Low Score (<50) = Red, Middle = Orange
            let scoreColor, scoreLabel;
            
            if (score > 80) {
                scoreColor = 'text-green-600';
                scoreLabel = 'High Authenticity';
            } else if (score < 50) {
                scoreColor = 'text-red-600';
                scoreLabel = 'Low Authenticity';
            } else {
                scoreColor = 'text-yellow-600';
                scoreLabel = 'Questionable';
            }

            // Visual Verdict
            const verdictIcon = isSuspicious ? '⚠️' : '✅';
            // Background turns red if score is low, green if high
            const bgColor = score < 50 ? 'bg-red-50' : (score > 80 ? 'bg-green-50' : 'bg-yellow-50');
            const borderColor = score < 50 ? 'border-red-200' : (score > 80 ? 'border-green-200' : 'border-yellow-200');

            imageResult.innerHTML = `
                <div class="${bgColor} border ${borderColor} rounded-xl p-6 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                        <h4 class="text-xl font-bold text-gray-900 flex items-center">
                            <span class="mr-2">${verdictIcon}</span> ${data.verdict}
                        </h4>
                        <div class="text-right">
                            <span class="block font-bold ${scoreColor} text-2xl">
                                ${score}/100
                            </span>
                            <span class="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                ${scoreLabel}
                            </span>
                        </div>
                    </div>
                    
                    <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h5 class="font-bold text-gray-800 mb-2">Forensic Analysis:</h5>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${data.reasoning}</p>
                    </div>

                    <div class="mt-4 text-xs text-gray-500 text-center">
                        Verified by Truth Lens AI
                    </div>
                </div>
            `;
        } else {
            throw new Error(data.error || 'Model refused to analyze this image.');
        }
    } catch (error) {
        imageResult.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 class="text-red-800 font-bold mb-2">❌ Analysis Failed</h4>
                <p class="text-red-700">${error.message}</p>
            </div>
        `;
        console.error('Fetch error:', error);
    } finally {
        setLoading(false, 'image');
    }
}
    
    // Helper functions for UI
    function switchMode(mode) {
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('bg-white', 'shadow-sm');
            tab.classList.add('hover:bg-gray-200');
        });
        if (mode === 'text') {
            textTab.classList.add('bg-white', 'shadow-sm');
            textTab.classList.remove('hover:bg-gray-200');
            textMode.classList.remove('hidden');
            imageMode.classList.add('hidden');
        } else {
            imageTab.classList.add('bg-white', 'shadow-sm');
            imageTab.classList.remove('hover:bg-gray-200');
            imageMode.classList.remove('hidden');
            textMode.classList.add('hidden');
        }
    }

    function smoothScrollTo(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    function useExampleText() {
        textInputEl.value = "Scientists have discovered a new particle at the LHC that could revolutionize energy production and lead to breakthrough technologies in the next decade.";
    }

    function useExampleImage() {
        // You can't use a local file for the example, as the API can't access it.
        alert('Please use a real image file for this function.');
    }

    // Event listeners
    textTab.addEventListener('click', () => switchMode('text'));
    imageTab.addEventListener('click', () => switchMode('image'));
    checkTextBtn.addEventListener('click', handleCheckText);
    checkImageBtn.addEventListener('click', handleCheckImage);
    exampleTextBtn.addEventListener('click', useExampleText);
    exampleImageBtn.addEventListener('click', useExampleImage);

    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute('href').substring(1));
        });
    });
    startVerifyingBtn.addEventListener('click', () => smoothScrollTo('verify'));
    learnMoreBtn.addEventListener('click', () => smoothScrollTo('features'));

    // Handle file uploads
    dropZone.addEventListener('click', () => imageInput.click());
    dropZone.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        dropZone.classList.add('border-blue-400'); 
    });
    
    dropZone.addEventListener('dragleave', () => { 
        dropZone.classList.remove('border-blue-400'); 
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-400');
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.classList.remove('hidden');
                dropContent.classList.add('hidden');
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.classList.remove('hidden');
                dropContent.classList.add('hidden');
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });
});
