/* eslint linebreak-style: ["error", "windows"] */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "react/no-multi-comp": "off" */
/* eslint "no-alert": "off" */
/* eslint max-classes-per-file: off */

function ProductTable({ productList }) {
  const productRows = productList.map((product) => (
    <ProductRow key={product.id} product={product} />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}


function ProductRow({ product }) {
  return (
    <tr>
      <td>{product.productName}</td>
      <td>{`$${product.price}`}</td>
      <td>{product.category}</td>
      <td><a href={product.image}>view</a></td>
    </tr>
  );
}
class ProductAdd extends React.Component {
  constructor() {
    super();
    this.priceRef = React.createRef();
    this.state = {
      defaultPrice: '$',
      categoryValue: '',
      URL: [
        {
          SHIRTS: 'https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609',
          JEANS: 'https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995',
          JACKETS: 'https://www.istockphoto.com/photo/black-hoodie-mock-up-gm695933044-128721993',
          SWEATERS: 'https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609',
          ACCESSORIES: 'https://www.shutterstock.com/image-vector/hair-accessories-woman-items-stylist-salon-1451306021',
        },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      productName: form.productName.value,
      category: form.category.value,
      price: parseFloat(form.price.value.replace(/\$/g, '')),
      image: form.image.value,
    };
    const { createProduct } = this.props;
    createProduct(product);

    form.productName.value = '';
    form.category.value = '';
    this.setState({
      defaultPrice: '$',
      URL: [
        {
          SHIRTS: 'https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609',
          JEANS: 'https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995',
          JACKETS: 'https://www.istockphoto.com/photo/black-hoodie-mock-up-gm695933044-128721993',
          SWEATERS: 'https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609',
          ACCESSORIES: 'https://www.shutterstock.com/image-vector/hair-accessories-woman-items-stylist-salon-1451306021',
        },
      ],
    });
  }

  handleChange(e) {
    this.setState({ defaultPrice: e.target.value });
  }

  render() {
    let btnClass = [
      'btn',
      'clearfix',
    ];
    btnClass = btnClass.join(' ');
    const { defaultPrice } = this.state;
    const { categoryValue } = this.state;
    const { URL } = this.state;

    return (
      <div>
        <form name="productAdd" onSubmit={this.handleSubmit} className="form">
          <div className="div1">
            Category
            <br />
            <select name="category" className="selectBox" onChange={(e) => this.setState({ categoryValue: e.target.value })}>
              <option aria-label="None" value="" />
              <option aria-label="shirts" value="SHIRTS">SHIRTS</option>
              <option aria-label="shirts" value="JEANS">JEANS</option>
              <option aria-label="jackets" value="JACKETS">JACKETS</option>
              <option aria-label="sweaters" value="SWEATERS">SWEATERS</option>
              <option aria-label="accessories" value="ACCESSORIES">ACCESSORIES</option>
            </select>
            <br />
            <br />
            Product Name
            <br />
            <input type="text" name="productName" />
            <br />
            <br />
          </div>
          <div className="div2">
            Price Per Unit
            <br />
            <input ref={this.priceRef} type="text" name="price" onChange={this.handleChange} value={defaultPrice} />
            <br />
            <br />
            Image URL
            <br />
            <input type="text" name="image" defaultValue={URL[0][categoryValue] || ''} />
            <br />
            <br />
          </div>
          <button type="submit" className={btnClass}>Add Product</button>
        </form>
      </div>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(`${window.ENV.UI_API_ENDPOINT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.text();

    const result = JSON.parse(body);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id productName price category image
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ products: data.productList });
    }
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInput!) {
      productAdd(product: $product) {
        id
      }
    }`;


    const data = await graphQLFetch(query, { product });
    if (data) {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <h3>Showing all available products</h3>
        <hr />
        <ProductTable productList={products} />
        <h3>Add a new product to the inventory</h3>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}
const element = <ProductList />;
ReactDOM.render(element, document.getElementById('content'));
