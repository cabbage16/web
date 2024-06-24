const API_KEY = 'c0ba48cad9a9999174d2720b0ffdb100';  // API 키 설정

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const query = document.getElementById('search-input').value;
            searchMovies(query);
        });
    }

    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    if (title) {
        loadBookDetails(decodeURIComponent(title));
    }
});

function getCurrentDateYYYYMMDD() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function searchMovies(query) {
    const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${API_KEY}&movieNm=${query}`;
}

function displayBooks(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // 결과 컨테이너 클리어

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';  // 클래스 추가
        bookDiv.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title} 표지">
            <div class="book-info">
                <h3><a href="detail.html?title=${encodeURIComponent(book.title)}">${book.title}</a></h3>
                <p>저자: ${book.authors.join(", ")}</p>
                <p>출판사: ${book.publisher}</p>
            </div>`;
        resultsDiv.appendChild(bookDiv);
    });
}

function loadBookDetails(title) {
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(title)}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `KakaoAK ${API_KEY}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.documents && data.documents.length > 0) {
            const book = data.documents[0];
            const salePrice = book.sale_price ? `${book.sale_price}원` : '정보 없음';
            const status = book.status ? book.status : '정보 없음';

            document.getElementById('book-details').innerHTML = `
                <img src="${book.thumbnail}" alt="${book.title} 표지" style="width:120px; height:auto;">
                <h1>${book.title}</h1>
                <p><strong>저자:</strong> ${book.authors.join(", ")}</p>
                <p><strong>번역:</strong> ${book.translators.join(", ") || "없음"}</p>
                <p><strong>출판사:</strong> ${book.publisher}</p>
                <p><strong>출판일:</strong> ${new Date(book.datetime).toLocaleDateString()}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>정가:</strong> ${book.price}원</p>
                <p><strong>판매가:</strong> ${salePrice}</p>
                <p><strong>상태:</strong> ${status}</p>
                <p><strong>소개:</strong> ${book.contents}...</p>
            `;
        } else {
            document.getElementById('book-details').innerHTML = `<p>책 정보를 찾을 수 없습니다.</p>`;
        }
    })
    .catch(error => console.error('Error:', error));
}