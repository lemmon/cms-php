const apiCall = ({ method, url, data }) => fetch(url, {
  method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(data),
  credentials: 'include',
}).then(res => (
  res.json()
)).then(res => {
  if (res.error) {
    throw Error(res.message || `Unknown error`)
  }
  return res
}).catch(err => {
  console.error(err)
})

module.exports.get = (target, data) => apiCall({
  method: 'GET',
  url: linkTo(target),
  data,
})

module.exports.post = (target, data) => apiCall({
  method: 'POST',
  url: linkTo(target),
  data,
})

module.exports.delete = (target, data) => apiCall({
  method: 'DELETE',
  url: linkTo(target),
  data,
})
