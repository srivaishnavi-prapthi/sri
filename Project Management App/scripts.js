let tasks = [
    { id: 1, title: "Task 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", deadline: "2024-07-01", status: "pending" },
    { id: 2, title: "Task 2", description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.", deadline: "2024-07-05", status: "ongoing" },
    { id: 3, title: "Task 3", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", deadline: "2024-07-10", status: "completed" }
];

function displayTasks() {
    const pendingTasksDiv = document.getElementById('pendingTasks');
    const ongoingTasksDiv = document.getElementById('ongoingTasks');
    const completedTasksDiv = document.getElementById('completedTasks');

    pendingTasksDiv.innerHTML = '';
    ongoingTasksDiv.innerHTML = '';
    completedTasksDiv.innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.setAttribute('draggable', 'true');
        card.setAttribute('ondragstart', 'drag(event)');
        card.setAttribute('data-task-id', task.id);

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><strong>Deadline:</strong> ${task.deadline}</p>
                <button class="btn btn-primary viewTaskBtn" data-toggle="modal" data-target="#taskModal" data-task-id="${task.id}">View Details</button>
            </div>
        `;

        if (task.status === 'pending') {
            pendingTasksDiv.appendChild(card);
        } else if (task.status === 'ongoing') {
            ongoingTasksDiv.appendChild(card);
        } else if (task.status === 'completed') {
            completedTasksDiv.appendChild(card);
        }
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.getAttribute('data-task-id'));
}

function drop(event, status) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");

    // Update task status
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
        displayTasks();
    }
}

// Modal functionality
$('#taskModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const taskId = button.data('task-id');
    const task = tasks.find(task => task.id == taskId);

    if (task) {
        $(this).find('.modal-title').text(task.title);
        $('#modalTaskTitle').text(task.title);
        $('#modalTaskDescription').text(task.description);
        $('#modalTaskDeadline').text(task.deadline);

        // Timer functionality (dummy implementation)
        let timerInterval;

        $('#startTimerBtn').off().click(function() {
            let seconds = 0;
            timerInterval = setInterval(function() {
                seconds++;
                $('#timerDisplay').text(formatTime(seconds));
            }, 1000);
        });

        $('#completeTaskBtn').off().click(function() {
            clearInterval(timerInterval);
            task.status = 'completed';
            displayTasks();
            $('#taskModal').modal('hide');
        });
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initial display of tasks
$(document).ready(function() {
    displayTasks();
});
