const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
var carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    pintarCards();
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const getAllProductsData = async() => {
        try {
            const res = await fetch('api.json')
            const data = await res.json()
            return data;
        } catch (error) {
            console.error
        }
    }
    //Falta metodo de api, se sustituye por un filter de momento
    //cambiar a funcion de flecha
async function getProductData(productId) {
    const products = await getAllProductsData();

    const result = products.filter(product => product.id == productId);
    console.log(result);
    return result;
}

const pintarCards = async() => {
    const products = await getAllProductsData();
    products.forEach(product => {
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('h2').textContent = `$${product.precio}.00`
        templateCard.querySelector('span').textContent = product.descrip
        templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = product.id
        console.log(templateCard.querySelector('.btn-dark').dataset.id)


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}

const addCarrito = async(e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains('btn-dark')) {
        const product = await getProductData(id);
        setCarrito(product)
    }
    e.stopPropagation()
}

const setCarrito = (objeto) => {
    console.log(objeto)
    const producto = objeto[0]
        //Esto
    producto.cantidad = 1;

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto }
    console.log(carrito);
    pintarCarrito()

}

const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).lenght == 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'

    }
    console.log(carrito);

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => {
        acc + cantidad;
        console.log(acc, cantidad);
    }, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => {
        acc + cantidad * precio;
        console.log(acc, cantidad, precio);
    }, 0)
    console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    // console.log(e.target)
    if (e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        pintarCarrito()
    }
}