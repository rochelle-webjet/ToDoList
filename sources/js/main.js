class PersonForm {

    constructor(options) {
        this.formName = options;
    };

    init() {
        this.renerToDoList();
        this.submitForm();
    };


    getKeyLength() {
        let array = [];
        for (let i = 0; i < localStorage.length; i++) {
            array.push(JSON.parse(localStorage.key(i)));
        }
        return (array.length > 0) ? Math.max(...array) : 0;
    };

    renerToDoList() {

        for (let i = 0; i < localStorage.length; i++) {

            let keyId = localStorage.key(i);
            let value = localStorage[keyId];
            let itemsLocal = JSON.parse(value);

            let taskName = itemsLocal[0];
            let taskDescription = (itemsLocal[1]) ? `<p class="todo-description" title="show more">${itemsLocal[1]}</p>` : '';
            let taskCheck = (itemsLocal[2] === 'checked') ? 'class="checked"' : '';

            let htmlTemplate = `
                <div data-id="${keyId}" style="position: relative;" ${taskCheck}>
                    <p class="todo-title">${taskName}</p>
                    ${taskDescription}
                    <span class="todo-remove" title="remove task"></span>
                </div>
            `;
            document.getElementById('taskList').innerHTML += htmlTemplate;
        }

        this.removeTask();
        this.doneCheckOrChecked();
        this.showMore();

    };

    removeTask() {
        let items = document.querySelectorAll('.todo-remove');

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function () {
                let key = this.parentNode.getAttribute('data-id');
                localStorage.removeItem(key);
                document.querySelector(`[data-id="${key}"]`).remove();
            });
        }
    };

    showMore() {
        let getShowMore = document.querySelectorAll('.todo-description');
        for (let i = 0; i < getShowMore.length; i++) {
            getShowMore[i].addEventListener('click', function () {
                this.classList.toggle('more');
            });
        };
    }

    doneCheckOrChecked() {

        let checkDone = document.querySelectorAll('.todo-title');

        for (let i = 0; i < checkDone.length; i++) {

            checkDone[i].addEventListener('click', function () {

                this.parentNode.classList.toggle('checked');
                let key = this.parentNode.getAttribute('data-id');

                let data = localStorage.getItem(key);
                let itemsLocal = JSON.parse(data);

                (itemsLocal.pop() === 'unchecked') ? itemsLocal.push('checked') : itemsLocal.push('unchecked');

                localStorage.setItem(key, JSON.stringify(itemsLocal));

            })
        }

    }

    submitForm() {

        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();

            let numberItems = this.getKeyLength();
            let taskID = numberItems === 0 ? 1 : numberItems + 1;

            let personForm = {
                'taskName': document.getElementById('taskName').value,
                'taskDescription': document.getElementById('taskDescription').value
            };

            if (personForm.taskName !== "") {
                let personItem = [personForm.taskName, personForm.taskDescription, 'unchecked'];

                localStorage.setItem(taskID, JSON.stringify(personItem));

                document.getElementById(this.formName).reset();
                location.reload();

            } else {

                let formPerson = document.getElementById(this.formName);
                formPerson.classList.add('novalid');
            }

        });
    };
};

new PersonForm('taskForm').init();