import Modal from "./Modal";
import Utils from "./Utils";
import { Socket } from "dgram";
import Connection from "./Connection";

export default class LoginForm extends Modal {
    private formElement: JQuery;
    private resolve: any = () => { };

    constructor() {
        super($('#loginModal'));
        this.formElement = this.element.find('form');

        (<any>this.element).modal({
            backdrop: 'static',
            keyboard: false,
        });

        this.registerHandler();
        this.show();
    }

    public getPromise(): Promise<[Socket, string, string]> {
        return new Promise(resolve => {
            this.resolve = resolve;
        })
    }

    private registerHandler() {
        this.element.find('[name="code"]').keyup(function () {
            $(this).val($(this).val().toString().toUpperCase());
        });

        this.element.find('input').on('input', () => {
            $('#loginModal .bg-warning').hide().text('');
        });

        this.element.find('input[type="radio"]').change(function () {
            if ($(this).val() === 'lecturer') {
                $('.credentials').show();
                $('.code').hide();
            } else {
                $('.credentials').hide();
                $('.code').show();
            }
        });

        this.formElement.submit(this.onSubmit.bind(this));
    }

    private async onSubmit(ev) {
        ev.preventDefault();

        this.formElement.prop('disabled', true);

        let role, user, token, socket;
        try {
            [role, user, token] = await this.processForm();
            [socket, role, user] = await Connection.get().connect(role, user, token);
        } catch (err) {
            console.warn('catch', err);

            this.formElement.find('.bg-warning').show().text(err);
            this.formElement.prop('disabled', false);

            return;
        }

        this.hide();

        localStorage.setItem('role', role);
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);

        this.resolve([socket, role, user]);

        return false;
    }

    private async processForm() {
        let role = this.formElement.find('[name="role"]:checked').val();
        let user = this.formElement.find('[name="username"]').val().toString().toLowerCase();
        let password = this.formElement.find('[name="password"]').val();
        let code = this.formElement.find('[name="code"]').val().toString().toUpperCase();
        let token = '';

        if (role === 'lecturer') {
            if (!user || !password) {
                throw 'Username and password required.';
            }

            token = await Utils.sha256(user + '|' + password);
        } else {
            role = 'student';
            user = Utils.generateId(20);
            token = await Utils.sha256(user + '|' + code);
        }

        return [role, user, token];
    }
}