function uploadResume() {
  const fileInput = document.getElementById("resume");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:8000/match", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    // Skills
    const skillsList = document.getElementById("skills");
    skillsList.innerHTML = "";
    data.skills_found.forEach(skill => {
      skillsList.innerHTML += `<li>${skill}</li>`;
    });

    // Internships
    const results = document.getElementById("results");
    results.innerHTML = "";
    data.recommended_internships.forEach(intern => {
      results.innerHTML += `
  <div class="card">
    ${intern.match_percent >= 60 ? `<span class="badge">Top Match</span>` : ""}
    <h4>${intern.title}</h4>
    <p><b>Company:</b> ${intern.company}</p>
    <p><b>Matched Skills:</b> ${intern.matched_skills.join(", ")}</p>

    <div class="progress">
      <div class="progress-bar" style="width:${intern.match_percent}%">
        ${intern.match_percent}%
      </div>
    </div>

    <a href="${intern.link}" target="_blank">Apply Now</a>
  </div>
`;

    });
  });
}
