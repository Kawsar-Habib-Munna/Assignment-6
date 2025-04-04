// ✅ Vocabulary JS Code

// Function to fetch and display lessons
window.loadLessons = async function() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/levels/all');
        const data = await res.json();
        const lessons = data.data;
        
        const container = document.getElementById('lesson-buttons');
        container.innerHTML = ''; // Clear existing buttons

        lessons.forEach(lesson => {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded transition-all duration-300 hover:bg-blue-500 hover:text-white';
            button.onclick = async function() {
                // Remove active class from all buttons
                document.querySelectorAll('#lesson-buttons button').forEach(btn => {
                    btn.classList.remove('bg-blue-500', 'text-white');
                    btn.classList.add('bg-white', 'text-blue-500');
                });
                
                // Add active class to this button
                this.classList.add('bg-blue-500', 'text-white');
                this.classList.remove('bg-white', 'text-blue-500');
                
                await loadWordsByLesson(lesson.level_no, this);
            };
            button.innerHTML = lesson.lessonName;
            container.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading lessons:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Failed to load lessons. Please try again.',
        });
    }
};

const wordContainer = document.getElementById("word-container");
const defaultText = document.getElementById("default-text");
const loadingSpinner = document.getElementById("loading-spinner");

// Loading spinner control functions
function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

window.loadWordsByLesson = async function (lessonId, clickedBtn) {
    defaultText.classList.add("hidden");
    wordContainer.innerHTML = "";
    showLoadingSpinner();
  
    // Update button styling
    document.querySelectorAll("#lesson-buttons button").forEach((btn) => {
        btn.classList.remove("bg-blue-500", "text-white");
    });
    clickedBtn.classList.add("bg-blue-500", "text-white");
  
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/level/${lessonId}`);
        const data = await res.json();
        const words = data.data || []; 
    
        hideLoadingSpinner();

        // Get vocab content element
        const vocabContent = document.getElementById('vocab-content');

        if (!words.length) {
            // Show vocab content when no words
            vocabContent.classList.remove('hidden');
            wordContainer.innerHTML = '';
            return;
        }

        // Hide vocab content when there are words
        vocabContent.classList.add('hidden');
    
        words.forEach((word) => {
            const card = document.createElement("div");
            card.className = "card bg-base-100 shadow-md p-4 flex flex-col items-start gap-2";
    
            card.innerHTML = `
                <h3 class="text-xl font-bold">${word.word || "Unnamed Word"}</h3>
                <p class="text-sm text-gray-600">Pronunciation: ${word.pronunciation || "N/A"}</p>
                <p class="text-gray-700">${word.meaning || "No meaning provided."}</p>
                <div class="flex justify-between w-full items-center gap-3">
                    <button onclick="pronounceWord('${word.word}')" class="btn btn-sm btn-outline" title="Pronounce">🔊</button>
                    <button onclick="showWordDetails('${word.id}')" class="btn btn-sm btn-outline" title="Details">ℹ️</button>
                </div>
            `;
            wordContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading words:", error);
        hideLoadingSpinner();
        wordContainer.innerHTML = `
            <p class="text-center text-red-500 col-span-full">❌ শব্দ লোড করতে সমস্যা হয়েছে!</p>`;
    }
};

// Function to show word details in a modal
window.showWordDetails = async function(wordId) {
    try {
      const res = await fetch(`https://openapi.programming-hero.com/api/word/${wordId}`);
      const data = await res.json();
      const word = data.data;
  
      // Log the example to console
      console.log('Example:', word.example);
  
      // Remove existing modal
      const existingModal = document.getElementById("word-detail-modal");
      if (existingModal) existingModal.remove();
  
      // Create modal overlay
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.id = 'word-detail-modal';
      modal.innerHTML = `
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative text-left">
    <button onclick="removeModal()" class="btn btn-sm btn-error absolute top-2 right-2">✕</button>

    <h2 class="text-2xl font-bold mb-1 flex items-center gap-2">
      ${word.word}
      <span class="text-gray-500 text-base">(${word.pronunciation || 'N/A'})</span>
      <button onclick="pronounceWord('${word.word}')" class="ml-1 text-indigo-600">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    </h2>

    <p class="mt-2"><strong>Meaning:</strong></p>
    <p class="mb-3 font-[your-custom-bangla-font]">${word.meaning || 'No meaning provided.'}</p>

    <p class="mb-1"><strong>Example:</strong></p>
    <p class="mb-3">${word?.sentence?.trim() || 'N/A'}</p>

    <p class="mb-1"><strong>সমার্থক শব্দগুলো:</strong></p>
    <div class="flex flex-wrap gap-2">
      ${
        word.synonyms && word.synonyms.length
          ? word.synonyms.map(s => `<span class="bg-gray-200 px-2 py-1 rounded text-sm">${s}</span>`).join('')
          : '<span class="text-gray-500">N/A</span>'
      }
    </div>

    <div class="flex justify-start gap-2 mt-6">
      
      <button onclick="removeModal()" class="btn btn-primary">Complete Learning</button>
    </div>
  </div>
`;

    

      document.body.appendChild(modal);
    } catch (error) {
      console.error('Error fetching word details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to load word details. Please try again.',
      });
    }
  };
  
  window.removeModal = function () {
    const modal = document.getElementById("word-detail-modal");
    if (modal) modal.remove();
  };

// Call on page load or when Vocabulary section is shown
loadLessons();