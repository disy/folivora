import Lecturer from "./Lecturer";
import Student from "./Student";
import LoginForm from "./LoginForm";
import Connection from "./Connection";
import Utils from './Utils'

function initUI(socket) {
    let pollElement = $('<div>');
    pollElement.attr('id', 'pollBar');
    pollElement.addClass('pollBar');
    pollElement.appendTo('body');

    let barElement = $('<nav>');
    barElement.attr('id', 'navBar');
    barElement.addClass('bar');
    barElement.appendTo('body');

    let logoutElement = $('<button>');
    logoutElement.text('Logout');
    logoutElement.appendTo(barElement);
    logoutElement.click(() => {
        if (confirm('Please confirm that you like to log-out.')) {
            logout(socket);
        }
    });
}

function logout(socket?) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    $('#pollBar').remove();
    $('#navBar').remove();
    $('body').css('background-image', `url()`);

    if (socket) {
        socket.close();
    }

    (<any> window.location) = window.location.pathname;
}

async function init() {
    let code = window.location.hash.replace(/^#/, '');
    let role = localStorage.getItem('role');
    let connectionPromise;

    if (!role && !code) {
        let loginForm = new LoginForm();

        connectionPromise = loginForm.getPromise();
    } else {
        let token = localStorage.getItem('token');
        let user = localStorage.getItem('user');

        if ((!token || !user) && code) {
            role = 'student';
            user = Utils.generateId(20);
            token = await Utils.sha256(user + '|' + code);
        }

        connectionPromise = Connection.get().connect(role, user, token).then(data => {
            localStorage.setItem('role', role);
            localStorage.setItem('user', user);
            localStorage.setItem('token', token);

            return data;
        });
    }

    connectionPromise.then(([socket, role, user]) => {
        initUI(socket);

        if (role === 'lecturer') {
            new Lecturer(user, socket);
        } else {
            new Student(user, socket);
        }
    }).catch(() => {
        logout();
    });
}

init();