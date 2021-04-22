/* Add your Application JavaScript */

// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});


app.component('app-header', {
    name: 'AppHeader',
    template: `
    <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <a class="navbar-brand" href="#">United Auto</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <router-link to="/" class="nav-link">Home</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/cars/new" class="nav-link">Add New Car</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/explore" class="nav-link">Explore</router-link>
                  </li>
                  <li class="nav-item active">
                    <router-link to="/logout" class="nav-link">Logout</router-link>
                  </li>
                </ul>
              </div>
            </nav>
      </header>
  `,
  data: function() {
    return {
      id: 0
    };
  },
  created:function(){
  },
  methods:{
    updateUser: function(){
      return router.push('/users/'+sessionStorage.getItem('user_id'));
    }
  }
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="flex-container">

    <div class="unitedauto-login">
      <div class="login-title">
        <h2>Buy and Sell <br> Cars Online</h2>
      </div>

      <div class="login-desc">
        <p>United Auto Sales provides the fastest, easiest and<br> most user friendly way to buy or sell cars online.
        Find a<br> Great Price on the Vechile You Want.</p>
      </div>

      <div class="login-buttons">
        <router-link to= "/register" tag= "button" type="button" class="btn btn-success" id="registerbtn">Register</router-link>
        <router-link to= "/login" tag= "button" type="button" class="btn btn-primary" id="loginbtn">Login</button></router-link>
      </div>
    </div>
    <div class="login-image">
      <img src="/static/assets/unitedautologo.jpg" alt="landsape" class="home-img">
    </div>

  </div>
`,
data: function(){
  return {}
}
};


const Register ={ 
    name: 'register',
    template:`
    <div class = "form-container">
  
      <div class = "content-holder width-100">
  
        <!--Heading-->
        <div class="header-container">
          <div class="header">
            <h1>Register New User</h1>
          </div>
        </div>
  
  
        <!--Form-->
        <div class="form2-container">
              <form @submit.prevent="upload" id="uploadForm" class = "register-form border-gray box-shadow" action ='' enctype= "multipart/form-data">
                <input type="hidden" name="csrf_token" :value="csrf"/>
                <label class = "form-control-label" id="rfc11">
                Username
                </label>
                <input type="text" name="username" class = "form-control" id="rfc1"></input>
  
                <label class = "form-control-label" id="rfc22">
                Password
                </label>
                <input type="password" name="password" class = "form-control" id="rfc2"></input>
  
                <label class = "form-control-label" id="rfc33">
                Fullname
                </label>
                <input type="text" name="name" class = "form-control"id="rfc3"></input>

                <label class = "form-control-label" id="rfc44">
                Email
                </label>
                <input type="text" name="email" class = "form-control" id="rfc4"></input>
  
                <label class = "form-control-label" id="rfc55">
                Location
                </label>
                <input type="text" name="location" class = "form-control" id="rfc5"></input>
  
                <label class = "form-control-label" id="rfc66">
                Biography
                </label>
                <textarea name="biography" rows="3" cols = "10" class = "form-control" id="rfc6"></textarea>
  
                <label class="form-control-label" id="rfc77">
                Photo
                </label>
                <input type="file" name="photo" id="rfc7"></input>
  
                <button type="submit" name="register" class="btn btn-success form-control margin-top-30" id="registerBTN">Register</button>
              </form>
        </div>
  
      </div>
  
    </div>
    `,
    data: function(){
        return {
          csrf: token
        }
    },
    methods: {
  
      upload: function(){
  
        let uploadForm = document.getElementById('uploadForm');
        let form_data = new FormData(uploadForm);
  
        fetch("/api/register",{
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          console.log(jsonResponse);
          if("message" in jsonResponse){
            router.push('/')
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }
  
  
    }
};


const AddNewCar ={ 
    name: 'newcar',
    template:`
    <div class = "newcarform-container">
  
      <div class = "content-holder width-100">
  
        <!--Heading-->
        <div class="newcar-container">
          <div class="header">
            <h1>Add New Car</h1>
          </div>
        </div>
        <!--Form-->
        <div class="newcarform2-container">
              <form @submit.prevent="upload" id="uploadForms" class = "addnewcar-form border-gray box-shadow" action ='' enctype= "multipart/form-data">
                <input type="hidden" name="csrf_token" :value="csrf"/>
                <label class = "form-control-label" id = "fc11">
                Make
                </label>
                <input type="text" name="make" class = "form-control " id = "fc1" placeholder="Tesla"></input>
  
                <label class = "form-control-label" id = "fc22">
                Model
                </label>
                <input type="text" name="model" class = "form-control" id = "fc2" placeholder="Model S"></input>
  
                <label class = "form-control-label" id = "fc33">
                Colour
                </label>
                <input type="text" name="colour" class = "form-control" id = "fc3" placeholder="Red"></input>

                <label class = "form-control-label" id = "fc44">
                Year
                </label>
                <input type="text" name="year" class = "form-control" id = "fc4" placeholder="2019"></input>
  
                <label class = "form-control-label" id = "fc55">
                Price
                </label>
                <input type="text" name="price" class = "form-control" id = "fc5" placeholder="62888"></input>

                <label class = "form-control-label" id = "fc66">
                Car Type
                </label>
                <select type="text" name="car_type" class = "form-control" id = "fc6">
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="sport">Sport</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                </select>

                <label class = "form-control-label" id = "fc77">
                Transmission
                </label>
                <select type="text" name="transmission" class = "form-control" id = "fc7">
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                </select>
  
                <label class = "form-control-label" id = "fc88">
                Description
                </label>
                <textarea name="description" rows="3" cols = "10" class = "form-control" id = "fc8"></textarea>
  
                <label class="form-control-label" id = "fc99">
                Upload Photo
                </label>
                <input type="file" name="photo" id = "fc9"></input>
  
                <button type="submit" name="save" class="btn btn-success form-control margin-top-30" id = "savebtn">Save</button>
                
                <input type="hidden" name="user_id"></input>
  
              </form>
        </div>
  
      </div>
  
    </div>
    `,
    data() {
        return {
        tester: sessionStorage.getItem('user_id')
        };
    },
    methods: {
  
      upload: function(){
  
        let uploadForm = document.getElementById('uploadForms');
        let form_data = new FormData(uploadForm);
        form_data.set('user_id', sessionStorage.getItem('user_id'));
  
        fetch("/api/cars",{
          method: 'POST',
          body: form_data,
          headers: {
            'X-CSRFToken': token,
            'Authorization': 'Bearer '+ sessionStorage.getItem('jwt_token')
          },
          credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          console.log(jsonResponse);
          if("message" in jsonResponse){
            router.push('/cars/new')
          }
          else {
            router.push('/login');
          }  
        })
        .catch(function(error){
          console.log(error);
        });
      }
  
  
    }
};





const Login = {

    name:'login',
    
    template:`
    <div class = "form-container">
      <div class = "content-holder width-100">
        <!--Heading-->
        <div class="flex-container">
          <div class="header">
            <h1>Login to your account</h1>
          </div>
        </div>
        <!--Form-->
        <div class="form-container">
          <div class="form-container">
              <form @submit.prevent="upload" id="uploadForm" class = "login-form border-gray box-shadow" action ='' enctype= "multipart/form-data">
                <input type="hidden" name="csrf_token" :value="csrf"/>
                <label class = "form-control-label">
                Username
                </label>
                <input type="text" name= "username" class = "form-control"></input>
  
                <label class = "form-control-label">
                Password
                </label>
                <input type="password" name="password" class = "form-control"></input>
  
                <input type="submit" class="btn btn-success form-control margin-top-30" id="loginbtnn" value="Login"></input>
  
              </form>
          </div>
        </div>
  
      </div>
  
    </div>
    `,
    data: function (){
      return {
        csrf: token
      }
    },
  
    methods:{
        upload: function(){
  
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
      
            fetch("/api/auth/login",{
              method: 'POST',
              body: form_data,
              headers: {
               'X-CSRFToken': token
              },
              credentials: 'same-origin'
            })
            .then(function(response){
              return response.json();
            })
            .then(function(jsonResponse){
              console.log(jsonResponse);
              if("token" in jsonResponse){
                let jwt_token = jsonResponse.token;
                let user_id = jsonResponse.user_id;
                sessionStorage.setItem('jwt_token',jwt_token);
                sessionStorage.setItem('user_id',user_id);
                router.push("/cars/new");
              }
              console.log(sessionStorage.getItem(user_id))
            })
            .catch(function(error){
              console.log(error);
            });
        }
      
      
    }
  
};
  
const Logout = { 
    name:'logout',
    data: function (){
    return {}
    },
    methods:{
    logout: function(){
        fetch('/api/auth/logout',{
        headers:{
            'Authorization' : 'Bearer '+ sessionStorage.getItem('jwt_token')
        }
        })
        .then(function(response){
        return response.json();
        })
        .then(function(jsonResponse){
        console.log(jsonResponse);

        })
        .catch(function(error){
        console.log(error);
        });
    }
    },
    created: function(){
    fetch('/api/auth/logout',{
        headers:{
        'Authorization' : 'Bearer '+ sessionStorage.getItem('jwt_token')
        }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(jsonResponse){
        console.log(jsonResponse);
        if("message" in jsonResponse){
        sessionStorage.clear();
        router.push('/login');
        }
        else{
        
        router.push('/');
        }
    })
    .catch(function(error){
        console.log(error);
    });
    }
};


const Explore = {
    name:'explore',
    template:`
    <h2> Explore </h2>
      <div class="post-container">
  
        <div class="flex-container flex-column width70">
  
          <div v-for="post in posts" class="posts border-gray box-shadow">
            <div class="post-image">
              <img v-bind:src="car.photo" alt=""></img>
            </div>

            <div class="post-caption">
              <p>{{ car.year }}</p>
            </div>

            <div class="post-caption">
              <p>{{ car.make }}</p>
            </div>

            <div class="post-caption">
              <p>{{ car.price }}</p>
            </div>

            <div class="post-caption">
              <p>{{ car.model }}</p>
            </div>

            </div>
  
          </div>
  
        </div>
      </div>
    `,
    data: function (){
      return {
        cars:[]
  
      }
    },
    created: function(){
      let self = this
      //fetch('/api/search',{
      fetch('/api/cars',{
        method: 'GET',
        headers:{
          'Authorization' : 'Bearer '+ sessionStorage.getItem('jwt_token')
        }
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        console.log(jsonResponse.posts);
        if("cars" in jsonResponse){
          self.cars = jsonResponse.cars;
        }
        else if("code" in jsonResponse){
          router.push('/');
        }
        else{
        }
      })
      .catch(function(error){
        console.log(error);
      });
    }
  
};

const Profile = {
  name:'profile',
  template: `
  <div>
    <div class="card row" style="width:100%">
        <div class="card-body row profile-header" style="padding: 0;" >
          <img id="profile_image" class="col-md-2" v-bind:src=user.profile_image style="width: 100%; height: 15%" />
          <div id="profile_info" class="col-md-7" style="margin-top: 0px;padding-right: 0;">
            <strong><label>{{ user.firstname }}</label>
            <label>{{ user.lastname }}</label></strong>
            <div id="local" style="color: gray;">
              <label>{{ user.location }}</label><br>
              <label>{{ user.joined_on }}</label>
            </div>
            <p id="bio" style="color: gray;">
              {{ user.bio }}
            </p>
          </div>
          <div id="follows" class="col-sm-3" style="padding-left:  0; padding-right:  0;">
            <strong><label id="posts" class="col-md-5">{{ user.postCount }}</label>
            <label id="followers" class="col-md-5">{{ user.followers }}</label></strong> <br>
            <label class="col-md-5" style="color: gray; font-weight: 600; font-size: larger;">Posts</label>
            <label class="col-md-6" style="color: gray; font-weight: 600; font-size: larger;">Followers</label>
            <label id="follow-btn" class="btn btn-primary" v-on:click="follow" style="width:100%; margin-top: 17%;">Follow</label>
          </div>
        </div>
    </div>
    
    <div id="post-area" class="row" style="width:100%;">
      <div class="profile-post col-md-4" style="margin-top:3%;" v-for="post in user.posts">
          <img v-bind:src=post.photo style="width: 100%;" />
      </div>
    </div>
  </div>
  `,
  methods: {
    follow: function(){
      self = this;
      
      fetch(`/api/users/${self.$route.params.user_id}/follow`,{
        method: "POST",
        headers: {
       
        },
        credentials: 'same-origin',
        body: JSON.stringify({"follower_id": JSON.parse(localStorage.current_user).id, "user_id": self.$route.params.user_id})
      }).then(function(response){
        return response.json();
      }).then(function(jsonResponse){
        
        if(jsonResponse.hasOwnProperty("message") && jsonResponse.status==201 ){
          $("#follow-btn")[0].innerHTML="Following";
          $("#follow-btn").removeClass("btn-primary");
          $("#follow-btn").addClass("btn-success")
          ++ self.user.followers;
        }
        
      }).catch(function(error){
        console.log(error)
      });
    }
  },
  created: function(){
    self = this;
    
    fetch(`/api/users/${self.$route.params.user_id}/posts`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
      }
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      self.user = jsonResponse.post_data;
    }).catch(function(error){
      console.log(error);
    });
  },
  data: function(){
    return {
      user: null,
      cu_id: (this.$route.params.user_id == JSON.parse(localStorage.current_user).id) ? true : false
    }
  }
};




const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [ 
    { path: '/', component: Home },
    // Put other routes here
    { path: '/register', component: Register },
    { path: '/cars/new', component: AddNewCar },
    { path: '/explore', component: Explore },
    { path: "/users/:user_id", name:"users",component: Profile},
    { path: '/login', component: Login },
    { path: '/logout', component: Logout },
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');