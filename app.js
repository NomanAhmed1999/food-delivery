




// initialize

let namee = document.getElementById("name");
let email = document.getElementById("email");
let phoneNumber = document.getElementById("phoneNumber");
let countryName = document.getElementById("countryName");
let CityName = document.getElementById("CityName");
let fullAddress = document.getElementById("fullAddress");
let password = document.getElementById("password");
let reTypePassword = document.getElementById("reTypePassword");
let profileInput = document.getElementById("profileInput");

let auth = firebase.auth();
let db = firebase.firestore();
let storage = firebase.storage();






// initialize for restorant
let restorantNamee = document.getElementById("restorantName");
let restorantEmail = document.getElementById("restorantEmail");
let restorantPhoneNumber = document.getElementById("restorantPhoneNumber");
let restorantCountryName = document.getElementById("restorantCountryName");
let restorantCityName = document.getElementById("restorantCityName");
let restorantFullAddress = document.getElementById("restorantFullAddress");
let restorantPassword = document.getElementById("restorantPassword");


let CurrentProfilePic = document.getElementById("CurrentProfilePic");
let profilePicInput = document.getElementById("profile-pic-input");
// initialize end


// User Account create



let CreateUser = () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;


      let usertObj = {
        userId: user.uid,
        namee: namee.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        countryName: countryName.value,
        CityName: CityName.value,
        fullAddress: fullAddress.value,
        userRole: "user",

      }

      saveUser(usertObj)




      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
}








let saveUser = (saveusertObj) => {
  console.log("usertObj")
  db.collection("User").doc(saveusertObj.userId).set(saveusertObj)
    .then(
      console.log("save restorant")
    )
}


let imageSelected = () => {
  let profile = profilePicInput.files[0];
  CurrentProfilePic.src = `./images/${profile.name}`;
  // console.log(profile.name);
  // console.log(CurrentProfilePic);
  // console.log(`./images/${profile.name}`);
}


let restorantId;

  let CreateRestorant = async () =>{
  await firebase.auth().createUserWithEmailAndPassword(restorantEmail.value, restorantPassword.value)
  .then(async (userCredential) => {
    var user = userCredential.user;
    
    
    var imgURL = await uploadImageToStorage(restorantId);
    console.log("ggguighui")
     restorantId = user.uid;
    console.log(imgURL)


      let restorantObj ={
        restorantImage: imgURL,
        restorantId: user.uid,
        restorantName: restorantNamee.value,
        restorantEmail: restorantEmail.value,
        restorantPhoneNumber: restorantPhoneNumber.value,
        restorantCountryName: restorantCountryName.value,
        restorantCityName: restorantCityName.value,
        restorantFullAddress: restorantFullAddress.value,
        userRole: "restorant",

      }
       db.collection('restorant').doc(restorantId).set(restorantObj);

      // saveRestorant(restorantObj)
      window.location = "admin-panel.html"





    })



    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
      console.log("errorMessage")
      // 
      // ..
    });




}


let uploadImageToStorage = (restorantIdpera) => {
  return new Promise(async (resolve, reject) => {
    let image = profilePicInput.files[0];
    storageRef = storage.ref();
    imageRef = storageRef.child(`userProfiles/${restorantIdpera}/${image.name}`);
    console.log(imageRef)
    await imageRef.put(image);
    let url = await imageRef.getDownloadURL();
    resolve(url)
  })


}



// User Account create end


let saveRestorant = (saveRestorantObj) => {
  console.log("restorantObj")
  db.collection("restorant").doc(saveRestorantObj.restorantId).set(saveRestorantObj)
    .then(
      console.log("save restorant")
    )
    .catch(
      console.log("errrrreor save restorant")
      )
}







let userId;

let restorantLogin = () => {


  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
       userId = userCredential.user.uid;
      // console.log("Document data:",userId);
      
      var docRef = db.collection("restorant").doc(userId);
      console.log(docRef.userRole);
      
      docRef.get().then((doc) => {
        console.log( userId);
        if (doc.exists) {
          let userObj = doc.data();
          if (userObj.userRole == "restorant") {
            window.location = "admin-panel.html";
          } else {

            // window.location = "index.html";
          }
          console.log("Document data:", doc.data(), userObj);
        } else {
          // doc.data() will be undefined in this case
          // window.location = "index.html"
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

      // console.log("welcome" );
      // let info = db.collection("restorant").doc(userId).data();
      // console.log(info)

      // window.location = "admin-panel.html"
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}



let forgatePassword = () => {
  firebase.auth().sendPasswordResetEmail(email.value)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
}



let uid;
let stateChange = () =>{
firebase.auth().onAuthStateChanged((user) => {
  if (user) {

     uid = user.uid;
    console.log("state change")
  } else {

  }
});


let userLogout = () => {

  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    window.location = "login-form.html";
  }).catch((error) => {
    // An error happened.
  });
}
}











function FecthList(){
  var docRef = db.collection("restorant").doc("uid");

  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          console.error("s");
      }
       else {
          // doc.data() will be undefined in this case
          console.log("No such document!",uid);
          console.log();
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
} 





function FetchRest(){
  db.collection("restorant")
.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log(change.doc.data())
            addRestrntinDom(change.doc.data())
         
          }
        if (change.type === "modified") {
            console.log("Modified ListItems: ", change.doc.data());
           
           
        }
        if (change.type === "removed") {
          console.log("Removed Item: ", change.doc.id);
        
        }
    });
});
} 


function addRestrntinDom(data){
  console.log(data)

// making restorant card in index page

let restorantContainer = document.getElementById("restorantContainer");
restorantContainer.setAttribute("class", "container");
// 

let containerCard = document.createElement("div");
containerCard.setAttribute("class", "restorant-card");
let divImg = document.createElement("div");
divImg.setAttribute("class", "divImg");

let labelImg = document.createElement("label");
let imgRestorant = document.createElement("img");
imgRestorant.src ="./images/restorant-img.jpg"
imgRestorant.setAttribute("class", "cart-img");


let imgInput = document.createElement("input");
imgInput.type = "file";
imgInput.setAttribute("class", "file-input");

labelImg.appendChild(imgInput);
labelImg.appendChild(imgRestorant);

divImg.appendChild(labelImg);
containerCard.appendChild(divImg);




let describtionDiv = document.createElement("div");
describtionDiv.setAttribute("class", "describe");
let labelDes = document.createElement("label");


let desInput = document.createElement("input");
desInput.type = "text";
desInput.setAttribute("id", "dish-describe");
desInput.placeholder = data.restorantName;

// let despera = document.createElement("p");
desInput.setAttribute("id", "restorantName");
let peraNode = document.createTextNode("describtionPrice");

// despera.appendChild(peraNode);
// labelDes.appendChild(despera);
labelDes.appendChild(desInput);
describtionDiv.appendChild(labelDes)
containerCard.appendChild(describtionDiv)



// let describtionDiv = document.createElement("div");
// describtionDiv.setAttribute("class", "describe");
let labelPrice = document.createElement("label");


let priceInput = document.createElement("input");
priceInput.type = "text";
priceInput.placeholder = "Price";
// priceInput.setAttribute("class", "file-input");

// let pricepera = document.createElement("p");
priceInput.setAttribute("id", "restorantName");
let pricePeraNode = document.createTextNode("pricepera");

// pricepera.appendChild(pricePeraNode);
// labelPrice.appendChild(pricepera);
labelPrice.appendChild(priceInput);
describtionDiv.appendChild(labelPrice);
containerCard.appendChild(describtionDiv);

restorantContainer.appendChild(containerCard); 

divv.appendChild(restorantContainer);

  


}

let divv =document.getElementById("divv")

// making restorant card in index page end






























































// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {

//       var uid = user.uid;
//         if(user){
//             console.log("login")
//         }
//         if(!user){
//             console.log("log out")
//             let user = firebase.auth().currentUser;

// if (user) {

//   // ...
// } else {
//     console.log("error")

// }
//         }
//         // ...
//     } else {
//         console.log("error")

//     }
//   });














    // // User Login
    // let userLogin = () =>{
//     firebase.auth().signInWithEmailAndPassword(email.value, password.value)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     window.location = "./index.html"
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.error(error);
//   });
// }
// // User Login end




// // user stateChange (checking user login or not)
// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/firebase.User
//       var uid = user.uid;
//       console.log("user login");
//       // window.location = "./index.html";
//       // ...
//     } else {
//       // User is signed out
//       // ...
//       console.log("user log out");
//       // window.location = "./login-form.html";
//     }
//   });
// // user stateChange end (checking user login or not)


// // logOut
// let userLogout = () =>{
//     firebase.auth().signOut().then(() => {
//         // Sign-out successful.
//       }).catch((error) => {
//         // An error happened.
//         console.warning(error);
//       });

// }
// // logOut


// // forgate password
// let forgatePassword = () => {
//     firebase.auth().sendPasswordResetEmail(email)
//   .then(() => {
//     // Password reset email sent!
//     // ..
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });
// }
// // forgate password end















// // let profile = profilePicInput.files[0];
// // unknownProfilePic.src = `./images/${profile.name}`


// function dpChange() {
//   let dpImgFile = profileInput.files[0];
//    profilePic.src = `./images/${dpImgFile.name}`
//     console.log(profileInput.files[0]);
//     console.log(profilePic);
// }












// let craetContainer = document.getElementById("craetContainer");
// craetContainer.style.display = "none";
// let displayCart = () =>{
//     if(craetContainer.style.display == "none"){
//         craetContainer.style.display = "block";
//     }else if(craetContainer.style.display = "block"){
//         craetContainer.style.display = "none";
//     }
// }


// let cartImg = document.getElementById("cartImg");
// console.log(cartImg);

// let items = (item) => {
//     let selectedItem = item.parentNode.parentNode.childNodes[1].src;
//     let itemImg = cartImg.src = selectedItem;
//     // console.log(item.parentNode.parentNode.childNodes[1].src);
//     // console.log(cartImg);

// }