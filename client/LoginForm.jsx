import React from "react";

export default class LoginForm extends React.Component{
   constructor(){
      super();

      this.handleSubmit = this.handleSubmit.bind(this);
   }
   /*TODO: pass data from ModalBody back to here*/
   render() {
      return(
         <div>
            <form onSubmit={this.handleSubmit}>
               <ModalHeader text={"Login"}/>
               <ModalBody />
            </form>
         </div>
   );
   }
}

class ModalHeader extends React.Component{
   render() {
      return(
         <div className={"modal-header"}>
            <h2>{this.prop.text}</h2>
         </div>
      );
   }
}

class ModalBody extends React.Component{
   constructor(){
      super();
      this.state.role="student";
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event){
      this.setState({
         role: event.target.value,
      });
   }

   render(){
      return(
         <div>
            <div>
               <input type={"ratio"} id={"roleStudent"} name={"role"} value={"student"}
                      checked={ this.state.role === "student" ? "checked" : false}
                      onChange={"this.handleChange()"}/>
               <label htmlFor="roleStudent"> Student </label>
               <input type={"ratio"} id={"roleLecturer"} name={"role"} value={"lecturer"}
                      checked={ this.state.role === "lecturer" ? "false" : "checked"}
                      onChange={"this.handleChange()"}/>/>
               <label htmlFor="roleLecturer"> Lecturer </label>
            </div>
            <div className={this.state.role === "student" ? "d-block" : "d-none" }>
               <label>
                  Code:
                  <input type="text" name="code" />
               </label>
            </div>
            <div className={this.state.role === "lecturer" ? "d-block" : "d-none" }>
               <label>
                  Username:
                  <input type="text" name="username" />
               </label>
               <label>
                  Password:
                  <input type="password" name="password" />
               </label>
            </div>
         </div>
         );

   }
}
