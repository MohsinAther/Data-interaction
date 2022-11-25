import React, {useEffect} from "react";
import {Button, Checkbox, Form, Input} from "antd";
import {Link} from "react-router-dom";

import {useSelector} from "react-redux";
import IntlMessages from "util/IntlMessages";
import InfoView from "../components/InfoView";

const FormItem = Form.Item;

const SignUp = (props) => {
  const token = useSelector(({auth}) => auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // call your signup action here
      }
    });
  };

  useEffect(() => {
    if (token !== null) {
      props.history.push('/');
    }
  });

  const {getFieldDecorator} = props.form;
  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img src='https://via.placeholder.com/272x395' alt='Neature'/>
            </div>
            <div className="gx-app-logo-wid">
              <h1><IntlMessages id="app.userAuth.signUp"/></h1>
              <p><IntlMessages id="app.userAuth.bySigning"/></p>
              <p><IntlMessages id="app.userAuth.getAccount"/></p>
            </div>
            <div className="gx-app-logo">
              <img alt="example" src="/assets/images/logo.png"/>
            </div>
          </div>

          <div className="gx-app-login-content">
            <Form onSubmit={handleSubmit} className="gx-signup-form gx-form-row0">
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{required: true, message: 'Please input your username!'}],
                })(
                  <Input placeholder="Name"/>
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{
                    required: true, type: 'email', message: 'The input is not valid E-mail!',
                  }],
                })(
                  <Input placeholder="Email"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: 'Please input your Password!'}],
                })(
                  <Input type="password" placeholder="Password"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox><IntlMessages id="appModule.iAccept"/></Checkbox>
                )}
                <span className="gx-link gx-signup-form-forgot"><IntlMessages
                  id="appModule.termAndCondition"/></span>
              </FormItem>
              <FormItem>
                <Button type="primary" className="gx-mb-0" htmlType="submit">
                  <IntlMessages id="app.userAuth.signUp"/>
                </Button>
                <span><IntlMessages id="app.userAuth.or"/></span> <Link to="/signin"><IntlMessages
                id="app.userAuth.signIn"/></Link>
              </FormItem>
            </Form>
          </div>
          <InfoView/>
        </div>
      </div>
    </div>
  );
};

const WrappedSignUpForm = Form.create()(SignUp);

export default WrappedSignUpForm;
