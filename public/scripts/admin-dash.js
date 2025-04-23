document.addEventListener('DOMContentLoaded', function() {
  // Get all filter checkboxes
  const filterCheckboxes = document.querySelectorAll('input[data-filter]');
  const completionMeter = document.getElementById('completion-meter');
  const completionPercentage = document.getElementById('completion-percentage');
  const monthlySummary = document.getElementById('monthly-summary-list');
  const chartContainer = document.getElementById('chart-container');
  
  
  const reportData = {
    completion: {
      value: 78,
      earlyPercentage: 33,
      incompletePercentage: 12,
      months: [
        { name: 'Jan', amount: null, status: null },
        { name: 'Feb', amount: null, status: null },
        { name: 'Mar', amount: 2000, status: 'Received' },
        { name: 'Apr', amount: 1200, status: 'Pending', highlight: true },
        { name: 'May', amount: null, status: null },
        { name: 'Jun', amount: null, status: null }
      ],
      metrics: {
        satisfaction: 4.8,
        repeatClients: 68,
        avgProjectValue: 2450
      }
    },
    payments: {
      //payments
    },
    custom: {
      //custom view
    }
  };

  // Function to show completion report
  function showCompletionReport() {
    const data = reportData.completion;
    
    // Update completion meter
    completionMeter.value = data.value;
    completionMeter.setAttribute('data-completion-rate', data.value);
    completionPercentage.textContent = `${data.value}%`;
    
    // Update early/incomplete percentages
    document.querySelector('.text-blue-600').textContent = `● Early (${data.earlyPercentage}%)`;
    document.querySelector('.text-gray-600').textContent = `● Incomplete (${data.incompletePercentage}%)`;
    
    // Populate monthly data
    monthlySummary.innerHTML = '';
    data.months.forEach(month => {
      const template = document.getElementById('month-template').content.cloneNode(true);
      const article = template.querySelector('article');
      
      // Set month name
      template.querySelector('[data-month-name]').textContent = month.name;
      
      // Set amount/status (if exists)
      if (month.amount) {
        template.querySelector('[data-amount-display]').textContent = 
          `${month.status} $${month.amount}`;
      } else {
        // Hide if no data
        template.querySelector('[data-amount-display]').textContent = 'N/A';
      }
      
      // Highlight if needed
      if (month.highlight) {
        article.classList.add('border-2', 'border-yellow-300');
      }
      
      monthlySummary.appendChild(template);
    });
    
    // Update metrics
    document.getElementById('satisfaction').innerHTML = `<strong>${data.metrics.satisfaction}/5.0</strong>`;
    document.getElementById('repeat-clients').innerHTML = `<strong>${data.metrics.repeatClients}%</strong>`;
    document.getElementById('avg-project-value').innerHTML = `<strong>$${data.metrics.avgProjectValue}</strong>`;
    
    // Update chart placeholder
    chartContainer.innerHTML = '<p class="text-gray-500">Project completion chart will load here</p>';
  }
 


  // Function to show payments report
  function showPaymentsReport() {
    // Clear previous data
    completionMeter.value = 0;
    completionPercentage.textContent = '0%';
    monthlySummary.innerHTML = '<li class="col-span-6 text-center py-4 text-gray-500">Loading payment data...</li>';
    
    // Update chart placeholder
    chartContainer.innerHTML = '<p class="text-gray-500">Payments analytics will load here</p>';
    

    // For now we'll just show a message
    setTimeout(() => {
      monthlySummary.innerHTML = `
        <li class="col-span-6 text-center py-4">
          <p>Payment analytics view</p>
          <p class="text-sm text-gray-600 mt-2">This would show payment-specific data</p>
        </li>
      `;
    }, 1000);
  }

  // Function to show custom report
  function showCustomReport() {
    // Clear previous data
    completionMeter.value = 0;
    completionPercentage.textContent = '0%';
    monthlySummary.innerHTML = '<li class="col-span-6 text-center py-4 text-gray-500">Loading custom view data...</li>';
    
    // Update chart placeholder
    chartContainer.innerHTML = '<p class="text-gray-500">Custom data visualization will load here</p>';
    
    //custom data
    setTimeout(() => {
      monthlySummary.innerHTML = `
        <li class="col-span-6 text-center py-4">
          <p>Custom analytics view</p>
          <p class="text-sm text-gray-600 mt-2">This would show custom report data</p>
        </li>
      `;
    }, 1000);
  }

  // Handle checkbox changes
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        // Uncheck other checkboxes
        filterCheckboxes.forEach(cb => {
          if (cb !== this) cb.checked = false;
        });
        
        // Show the appropriate report
        switch(this.dataset.filter) {
          case 'completion':
            showCompletionReport();
            break;
          case 'payments':
            showPaymentsReport();
            break;
          case 'custom':
            showCustomReport();
            break;
        }
      } else if (![...filterCheckboxes].some(cb => cb.checked)) {
        // If no checkboxes are checked, show completion by default
        document.getElementById('completion-rates').checked = true;
        showCompletionReport();
      }
    });
  });

  // Initialize with completion report shown
  document.getElementById('completion-rates').checked = true;
  showCompletionReport();
});
