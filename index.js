let text1 = document.getElementById('text1');
let text2 = document.getElementById('text2');
let img1 = document.getElementById('img1');
let header = document.getElementById('header');
let navi = document.querySelector('.navi');

// ini buat parallax jadi saya pisah debngan pagenya
window.addEventListener('scroll', () => {
    let value = window.scrollY;

    text1.style.marginTop = value * 2.5 + 'px';
    img1.style.opacity = 1 - value * 0.001;
    header.style.backgroundColor = `rgba(255, 105, 35, ${1 - value * 0.002})`;
    navi.style.opacity = 1 - value * 0.001;
});

let currentPage = 1;
let pageSize = 10;
let sortBy = '-published_at';

const prevButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const sortSelect = document.getElementById('sortBy');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const cardsContainer = document.querySelector('.cards');

const fetchApi = (url) => {
    return fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }).then(response => response.json());
};

const renderCards = (data) => {
    cardsContainer.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = 
        `<div class="img-card">
                <img src="media/person.jpeg" alt="image" loading="lazy">
            </div>
            <div class="uploadby">
                ${item.published_at}
            </div>
            <div class="info-card">
                <h3>${item.title}</h3>
                <p>${item.content.substring(0, 150)}</p>
            </div>`;

            card.addEventListener('click', () => {
                const content = card.querySelector('.content');
                
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
                
                console.log(item); 
            });

        cardsContainer.appendChild(card);
    });
};

const showData = async (pageNumber, pageSize, sortBy) => {
    const append = ['small_image', 'medium_image'];
    let url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${pageNumber}&page[size]=${pageSize}&sort=${sortBy}`;

    append.forEach(item => {
        url += `&append[]=${item}`;
    });

    try {
        const { data, links } = await fetchApi(url);
        renderCards(data);

        previous = links?.prev || null;
        next = links?.next || null;

        prevButton.disabled = !previous;
        nextButton.disabled = !next;

        updatePage(pageNumber);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const updatePage = (pageNumber) => {
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
            link.classList.add('active');
    });
};

const pageButtons = document.querySelectorAll('.item-page .link-page');
pageButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const pageNumber = parseInt(event.target.textContent);
        currentPage = pageNumber; 
        showData(currentPage, pageSize, sortBy);
    });
});

const prevbtn = async () => {
    currentPage--;
    await showData(currentPage, pageSize, sortBy);
};

const nextbtn = async () => {
    currentPage++;
    await showData(currentPage, pageSize, sortBy);
};

sortSelect.addEventListener('change', (event) => {
    sortBy = event.target.value;
    currentPage = 1;
    showData(currentPage, pageSize, sortBy);
});

itemsPerPageSelect.addEventListener('change', (event) => {
    pageSize = event.target.value;
    currentPage = 1;
    showData(currentPage, pageSize, sortBy);
});

showData(currentPage, pageSize, sortBy);

prevButton.addEventListener("click", prevbtn);
nextButton.addEventListener("click", nextbtn);
