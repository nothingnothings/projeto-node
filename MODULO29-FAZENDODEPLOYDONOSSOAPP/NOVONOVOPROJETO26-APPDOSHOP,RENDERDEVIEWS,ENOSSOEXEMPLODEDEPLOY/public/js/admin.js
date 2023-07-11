const deleteProduct = (button) => {
  //ver view de 'product-list-admin', no button de 'delete', em que colocamos 'onClick=deleteProduct(this)'... (o 'this' é o ELEMENTO BUTTON EM SI...)
  // console.log('Clicked');

  // console.log(button);

  // console.log(button.parentNode.querySelector('[name=id]').value);

  const productId = button.parentNode.querySelector('[name=id]').value;

  const csrfToken = button.parentNode.querySelector('[name=_csrf]').value;



const data =  {
  // productId: JSON.stringify(productId),
  // csrfToken: JSON.stringify(csrfToken)
  productId: productId,
  csrfToken: csrfToken //não stringifie a sua token, senão o 'CSURF' não consegue a compreender/parsear...
}


console.log(data.csrfToken);


  fetch(`/admin/product/${productId}`, { ///checar route de 'deleteProduct' lá no arquivo route de 'admin.js'
    method: 'DELETE',
    // body: JSON.stringify(data), ////só é usado com POST REQUESTS...
    headers: {
      'csrf-token': data.csrfToken  ///////SEMPRE VAMOS PRECISAR DESSA 'csrf-token' (é o nome da KEY A QUAL O 'csurf' VAI FAZER 'LOOKUP', vai procurar AUTOMATICAMENTE NOS NOSSOS HEADERS...)
    }
  }
  )
  .then(
      (result) => {
            const grid = button.parentNode.parentNode.parentNode.parentNode;
            const product = button.parentNode.parentNode;
            grid.remove(product);
          console.log(result);
      }
  )
  .catch(
    (err) => {

      console.log(err);

    }
  )

  // console.log(button.parentNode.querySelector('[name=_csrf]').value);
};
