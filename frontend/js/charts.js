document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('riskDistributionChart');

    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allows chart canvas to stretch fluidly
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                                size: window.innerWidth <= 768 ? 11 : 13
                            }
                        }
                    }
                }
            }
        });
    }
});