async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || 'Permintaan gagal. Silakan coba lagi.');
    error.status = response.status;
    throw error;
  }

  return result;
}

export function getProducts() {
  return request('/products');
}

export function getProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`);
}

export function createProduct(product) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
