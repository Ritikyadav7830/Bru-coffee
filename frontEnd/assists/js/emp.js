/***************************************
 * YEAR DROPDOWN (1980–2030)
 ***************************************/

document.querySelectorAll ('.year-select').forEach (select => {
  select.innerHTML = `<option value="">Select Year</option>`;
  for (let year = 1980; year <= 2030; year++) {
    select.innerHTML += `<option value="${year}">${year}</option>`;
  }
});

/***************************************
 * EMPLOYMENT HISTORY (ADD JOB)
 ***************************************/
const employmentSection = document.getElementById ('employment-section');
const submitBtn = document.querySelector ('.submit-btn');

function createJob (index, showAddBtn = true) {
  const jobDiv = document.createElement ('div');
  jobDiv.classList.add ('job-box');

  jobDiv.innerHTML = `
        <h4>Job ${index}</h4>

        <label>Company Name *</label>
        <input type="text" class="company">

        <label>Designation / Role *</label>
        <input type="text" class="role">

        <div class="grid">
            <div>
                <label>From Date *</label>
                <input type="date" class="from-date">
            </div>
            <div>
                <label>To Date *</label>
                <input type="date" class="to-date">
            </div>
        </div>

        ${showAddBtn ? `<button type="button" class="add-job">+ Add Another Job</button>` : ''}
    `;

  return jobDiv;
}

// First Job
employmentSection.appendChild (createJob (1, true));

// Only last job has Add button
employmentSection.addEventListener ('click', function (e) {
  if (e.target.classList.contains ('add-job')) {
    e.target.remove ();
    const count = employmentSection.querySelectorAll ('.job-box').length;
    employmentSection.appendChild (createJob (count + 1, true));
  }
});

/***************************************
 * FORM SUBMIT + VALIDATION + JSON SAVE
 ***************************************/
submitBtn.addEventListener ('click', function (e) {
  e.preventDefault ();

  /* ---------- PERSONAL DETAILS ---------- */
  const personalDetails = {
    fullName: document.querySelector ('.full-name').value.trim (),
    email: document.querySelector ('.email').value.trim (),
    phone: document.querySelector ('.phone').value.trim (),
    remark: document.querySelector ('.remark').value.trim (),
  };

  if (
    !personalDetails.fullName ||
    !personalDetails.email ||
    !personalDetails.phone
  ) {
    alert ('Please fill all Personal Details');
    return;
  }
 if (personalDetails.phone.length !== 10) {
  alert('Please enter a 10-digit mobile number');
  return;
}

  /* ---------- EDUCATION ---------- */
  const education = {
    tenthYear: document.querySelector ('.year-10').value,
    twelfthYear: document.querySelector ('.year-12').value,
    graduation: {
      degree: document.querySelector ('.grad-degree').value.trim (),
      year: document.querySelector ('.grad-year').value,
    },
    postGraduation: {
      degree: document.querySelector ('.pg-degree').value.trim (),
      year: document.querySelector ('.pg-year').value,
    },
  };

  if (
    !education.tenthYear ||
    !education.twelfthYear ||
    !education.graduation.degree ||
    !education.graduation.year
  ) {
    alert ('Please fill all required Education details');
    return;
  }

  /* ---------- EMPLOYMENT HISTORY ---------- */
  let jobsData = [];
  const jobs = document.querySelectorAll ('.job-box');

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];

    const company = job.querySelector ('.company').value.trim ();
    const role = job.querySelector ('.role').value.trim ();
    const fromDate = job.querySelector ('.from-date').value;
    const toDate = job.querySelector ('.to-date').value;

    if (!company || !role || !fromDate || !toDate) {
      alert (`Please fill all fields in Job ${i + 1}`);
      return;
    }

    if (toDate < fromDate) {
      alert (`To Date cannot be earlier than From Date in Job ${i + 1}`);
      return;
    }

    jobsData.push ({company, role, fromDate, toDate});
  }

  /* ---------- FINAL JSON ---------- */
  const finalJSON = {
    fullName: personalDetails.fullName,
    email: personalDetails.email,
    phone: personalDetails.phone,
    remark: personalDetails.remark,
    education: education,
    employmentHistory: jobsData,
  };

  console.log (finalJSON);

fetch('http://localhost:3000/api/candidates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(finalJSON),
})
  .then(res => {
    if (!res.ok) {
      throw new Error('Server error');
    }
    return res.json();
  })
  .then(data => {
    if (data.status) {
      const link = document.createElement('a');
      link.href = data.pdfUrl;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Form submitted & PDF downloaded!');
      document.querySelector('form').reset();
    } else {
      alert(data.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert('Server error');
  });


});




