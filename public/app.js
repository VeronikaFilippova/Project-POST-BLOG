let editingPost = null;

function fetchPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';
            
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <p>Автор: ${post.author}</p>
                    <button onclick="startEditPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                `;
                postsContainer.appendChild(postElement);
            });
        });
}

function startEditPost(id) {
    fetch(`/api/posts/${id}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('postId').value = post.id;
            document.getElementById('title').value = post.title;
            document.getElementById('description').value = post.description;
            document.getElementById('author').value = post.author;
            editingPost = post;
        });
}

document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const postData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        author: document.getElementById('author').value
    };

    const postId = document.getElementById('postId').value;
    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `/api/posts/${postId}` : '/api/posts';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(response => {
        if (response.ok) {
            resetForm();
            fetchPosts();
        }
    }).catch(error => {
        console.error('Помилка:', error);
    });
});

function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    editingPost = null;
}

function deletePost(id) {
    if (confirm('Ви впевнені, що хочете видалити цей пост?')) {
        fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                fetchPosts();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('postForm');
    if (!document.getElementById('postId')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'postId';
        hiddenInput.name = 'postId';
        form.insertBefore(hiddenInput, form.firstChild);
    }
    fetchPosts();
});

