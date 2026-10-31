async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const getFilters = () => request('/api/clinics/meta/filters');

export const getClinics = ({ specialty, city }) => {
  const params = new URLSearchParams();
  if (specialty) params.set('specialty', specialty);
  if (city) params.set('city', city);
  return request(`/api/clinics?${params}`);
};

export const getClinic = (id) => request(`/api/clinics/${id}`);

export const createAppointment = (body) =>
  request('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });