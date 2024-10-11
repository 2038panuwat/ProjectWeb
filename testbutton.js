const successA = document.querySelector('#successA')
const errorA = document.querySelector('#errorA')
const confirmA = document.querySelector('#confirmA')

successA.addEventListener('click', function(){
    swal.fire({
        icon: 'success',
        title: 'Success',
        timer: 2000
    })
})
errorA.addEventListener('click', function(){
    swal.fire({
        icon: 'error',
        title: 'Error',
        timer:2000
    })
})
confirmA.addEventListener('click', function(){
    swal.fire({
        icon: 'question',
        title: 'Are you sure!',
        showCancelButton: true
    })
})