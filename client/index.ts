import Lecturer from "./Lecturer";
import Student from "./Student";
import LoginForm from "./LoginForm";
import Connection from "./Connection";

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
    logoutElement.click(() => logout(socket));
}

function logout(socket) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    $('#pollBar').remove();
    $('#navBar').remove();
    $('body').css('background-image', `url()`);

    if (socket) {
        socket.close();
    }

    window.location = window.location;
}

function init() {
    let role = localStorage.getItem('role');
    let connectionPromise;

    if (!role) {
        let loginForm = new LoginForm();

        connectionPromise = loginForm.getPromise();
    } else {
        let token = localStorage.getItem('token');
        let user = localStorage.getItem('user');

        connectionPromise = Connection.get().connect(role, user, token);
    }

    connectionPromise.then(([socket, role, user]) => {
        initUI(socket);

        if (role === 'lecturer') {
            new Lecturer(user, socket);
        } else {
            new Student(user, socket);
        }
    });
}

init();