document.addEventListener('DOMContentLoaded', function () {
    const ageButtons = document.querySelectorAll('.age-button-cta');
    const ageMessage = document.getElementById('age-message');
    const finalCtaButton = document.getElementById('final-cta-button');
    let selectedAgeRange = null;

    // Set the direct URL for all CTAs
    const DIRECT_CTA_URL = "https://track.smartconsumerus.com/click";

    ageButtons.forEach(button => {
        button.addEventListener('click', function() {
            ageButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedAgeRange = this.dataset.age; // Still useful for display or other logic if needed

            if (ageMessage) {
                // You can keep this message or change it, as the redirect is immediate
                ageMessage.textContent = `Processing for age ${selectedAgeRange}...`;
            }

            // Redirect to the direct URL
            window.location.href = DIRECT_CTA_URL;
        });
    });

    if (finalCtaButton) {
        // The href is already set in HTML, but we can also set it here for consistency
        // or if the HTML might change.
        finalCtaButton.href = DIRECT_CTA_URL;

        finalCtaButton.addEventListener('click', function(event) {
            // No need to check for selectedAgeRange if all buttons go to the same place
            // The default action (following the href) will occur.
            // If you wanted to prevent navigation under some condition, you'd add event.preventDefault() here.
        });
    }

    // --- Location Text & Map Update ---
    const userStateElement = document.getElementById('user-state');
    const userStateRepeatedElement = document.getElementById('user-state-repeated');
    const urgentBannerStateNameElement = document.getElementById('urgent-banner-state-name');

    const exampleStateData = [
        { id: 'US-CA', name: 'California' }, { id: 'US-TX', name: 'Texas' },
        { id: 'US-NY', name: 'New York' }, { id: 'US-FL', name: 'Florida' },
        { id: 'US-OH', name: 'Ohio' }, { id: 'US-IL', name: 'Illinois' },
        { id: 'US-GA', name: 'Georgia'}
    ];
    
    // Function to find state data by name
    const getStateData = (stateName) => {
        return exampleStateData.find(state => state.name.toLowerCase() === stateName.toLowerCase());
    }

    let stateName = "The United States";
    let stateId = null;

    // RedTrack Integration
    const urlParams = new URLSearchParams(window.location.search);
    const redTrackState = urlParams.get('sub1'); // Assuming sub1 is for state
    const redTrackRegion = urlParams.get('sub2'); // Assuming sub2 is for region

    let detectedState = null;
    if (redTrackState) {
        detectedState = getStateData(redTrackState);
    } else if (redTrackRegion) {
        detectedState = getStateData(redTrackRegion);
    }

    if(detectedState) {
        stateName = detectedState.name;
        stateId = detectedState.id;
    } else {
        // Fallback to existing IP-based method
        const shouldSimulateDetection = Math.random() > 0.3;
        if (shouldSimulateDetection) {
            const detected = exampleStateData[Math.floor(Math.random() * exampleStateData.length)];
            stateName = detected.name;
            stateId = detected.id;
        }
    }


    if (userStateElement) userStateElement.textContent = stateName;
    if (userStateRepeatedElement) userStateRepeatedElement.textContent = stateName;
    if (urgentBannerStateNameElement) urgentBannerStateNameElement.textContent = stateName;

    const svgMapContainer = document.getElementById('us-map-svg-container');
    if (svgMapContainer) {
        const allStatesInSvg = svgMapContainer.querySelectorAll('.land');
        allStatesInSvg.forEach(p => p.classList.remove('highlighted'));

        if (stateName === "The United States") {
            allStatesInSvg.forEach(p => p.classList.add('highlighted'));
        } else if (stateId) {
            const statePathToHighlight = svgMapContainer.querySelector(`#${stateId}`);
            if (statePathToHighlight) {
                statePathToHighlight.classList.add('highlighted');
            } else {
                console.warn(`State ID '${stateId}' for '${stateName}' not found in the SVG.`);
            }
        }
    }
    // --- End Location Text & Map Update ---

    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's not the final CTA button if its href was "#" before JS update
            if (this.id !== 'final-cta-button' && hrefAttribute && hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                     e.preventDefault();
                     targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});