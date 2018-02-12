//Fake RESTful API

let data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    display: `User ${i + 1}`,
    enabled: true
}));

export function queryUsers(q) {
    return new Promise(resolve => {
        let result = data.filter(user => !q || user.username.indexOf(q) !== -1);
        //simulate server response delay
        setTimeout(() => resolve(result), 100);
    });
}

export function getUser(id) {
    return new Promise(resolve => {
        let index = data.findIndex(u => u.id == id);
        resolve(data[index]);
    });
}

export function putUser(id, user) {
    return new Promise(resolve => {
        let index = data.findIndex(u => u.id == id);
        if (index === -1) throw new Error("User not found!");
        let result = (data[index] = {
            ...data[index],
            ...user,
            id: id
        });
        resolve(result);
    });
}

export function postUser(user) {
    return new Promise(resolve => {
        let id = data.length + 1;
        let result = {
            ...user,
            id: id
        };
        data.push(result);
        resolve(result);
    });
}

export function deleteUser(id) {
    return new Promise(resolve => {
        data = data.filter(u => u.id != id);
        resolve();
    });
}
