const postcodeInput = document.getElementById('postcode');
const lookupBtn = document.getElementById('lookup-btn');
const addressContainer = document.getElementById('address-container');
const addressSelect = document.getElementById('address-select');
const addressFields = document.getElementById('address-fields');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const town = document.getElementById('town');
const county = document.getElementById('county');

const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]? \d[A-Z]{2}$/i;

async function lookup() {
  const postcode = postcodeInput.value.trim();
  if (!ukPostcodeRegex.test(postcode)) {
    alert('Please enter a valid UK postcode');
    return;
  }

  lookupBtn.disabled = true;
  lookupBtn.textContent = 'Looking up...';
  try {
    const res = await fetch(`/api/uk-addresses?postcode=${encodeURIComponent(postcode)}`);
    if (!res.ok) {
      throw new Error('lookup failed');
    }
    const data = await res.json();
    addressSelect.innerHTML = '';
    data.addresses.forEach(addr => {
      const option = document.createElement('option');
      option.value = addr;
      option.textContent = addr;
      addressSelect.appendChild(option);
    });
    addressContainer.style.display = 'block';
  } catch (err) {
    console.error(err);
    alert('Failed to lookup postcode');
  }
  lookupBtn.disabled = false;
  lookupBtn.textContent = 'Find address';
}

lookupBtn.addEventListener('click', lookup);
postcodeInput.addEventListener('blur', () => {
  if (postcodeInput.value.trim()) lookup();
});

addressSelect.addEventListener('change', () => {
  const parts = addressSelect.value.split(',').map(p => p.trim());
  line1.value = parts[0] || '';
  line2.value = parts[1] || '';
  town.value = parts[parts.length - 2] || '';
  county.value = parts[parts.length - 1] || '';
  addressFields.style.display = 'block';
});
