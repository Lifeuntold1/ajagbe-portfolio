// State Management
let bookingData = {
    specialty: null,
    time: null
};

// Step 1: Select Specialty
function selectSpecialty(name, element) {
    bookingData.specialty = name;

    // Visual Feedback (Remove 'selected' from all, add to clicked)
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');

    // Enable Button
    document.getElementById('btn-step1').disabled = false;
}

// Step 2: Select Time
function selectTime(time, element) {
    bookingData.time = time;

    // Visual Feedback
    document.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');

    // Enable Button
    document.getElementById('btn-step2').disabled = false;
}

// Navigation Logic
function goToStep(stepNum) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active-screen'));

    // Show target screen
    document.getElementById(`step${stepNum}`).classList.add('active-screen');

    // Update Progress Bar
    updateProgress(stepNum);

    // If entering Step 2, update dynamic text
    if (stepNum === 2) {
        document.getElementById('selected-doc').innerText = bookingData.specialty;
    }

    // If entering Step 3, update summary
    if (stepNum === 3) {
        document.getElementById('final-doc').innerText = bookingData.specialty;
        document.getElementById('final-time').innerText = bookingData.time;
    }
}

function updateProgress(stepNum) {
    // Reset all steps
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`p-step${i}`);
        if (i <= stepNum) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    }
}