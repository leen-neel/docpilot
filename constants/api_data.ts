export const dummyDoc = {
  id: "asldjfsladkfw3jld",
  apiName: "Task Manager API",
  version: "1.0.0",
  description: "Manage tasks, users, and authentication seamlessly.",
  baseURL: "https://api.taskmanager.com/v1",
  servers: [
    {
      url: "https://api.taskmanager.com/v1",
      description: "Production server",
    },
    {
      url: "https://staging.taskmanager.com/v1",
      description: "Staging server",
    },
  ],
  endpoints: [
    {
      id: "endpoint_001",
      path: "/auth/register",
      method: "POST",
      summary: "Register a new user",
      description: "Create a new account using email, password, and name.",
      tags: ["Authentication"],
      security: "None",
      headers: {
        "Content-Type": "application/json",
      },
      queryParams: [],
      pathParams: [],
      requestBody: {
        required: true,
        contentType: "application/json",
        example: {
          email: "user@example.com",
          password: "strongpassword",
          name: "John Doe",
        },
      },
      responses: {
        "201": {
          description: "User registered successfully",
          example: {
            token: "jwt_token_here",
            expiresIn: 3600,
          },
        },
        "400": {
          description: "Invalid input",
        },
      },
      codeSamples: {
        curl: 'curl -X POST https://api.taskmanager.com/v1/auth/register -H "Content-Type: application/json" -d \'{"email":"user@example.com","password":"strongpassword","name":"John Doe"}\'',
        nodejs:
          "await axios.post('/auth/register', { email, password, name });",
      },
      mockServer: {
        url: "https://mock.taskmanager.com/v1/auth/register",
        exampleResponse: {
          token: "mock_jwt_token",
          expiresIn: 3600,
        },
      },
      sdkAvailable: ["javascript", "python"],
    },
    {
      id: "endpoint_002",
      path: "/tasks",
      method: "GET",
      summary: "Get list of tasks",
      description: "Retrieve tasks filtered by status with pagination support.",
      tags: ["Tasks"],
      security: "Bearer Token (JWT)",
      headers: {
        Authorization: "Bearer <token>",
      },
      queryParams: [
        {
          name: "status",
          type: "string",
          required: false,
          description:
            "Filter tasks by status (pending, in_progress, completed)",
        },
        {
          name: "limit",
          type: "integer",
          required: false,
          default: 20,
          description: "Number of tasks to return",
        },
        {
          name: "offset",
          type: "integer",
          required: false,
          default: 0,
          description: "Pagination offset",
        },
      ],
      pathParams: [],
      requestBody: null,
      responses: {
        "200": {
          description: "List of tasks",
          example: [
            {
              id: "task_123",
              title: "Finish project",
              status: "pending",
              dueDate: "2024-05-01T00:00:00Z",
            },
          ],
        },
        "401": {
          description: "Unauthorized",
        },
      },
      codeSamples: {
        curl: 'curl -H "Authorization: Bearer <token>" https://api.taskmanager.com/v1/tasks',
        nodejs:
          "await axios.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });",
      },
      mockServer: {
        url: "https://mock.taskmanager.com/v1/tasks",
        exampleResponse: [
          {
            id: "mock_task_001",
            title: "Mock Task",
            status: "pending",
          },
        ],
      },
      sdkAvailable: ["javascript", "python", "go"],
    },
    {
      id: "endpoint_003",
      path: "/tasks/{taskId}",
      method: "PATCH",
      summary: "Update a task",
      description:
        "Update title, description, status, or due date of an existing task.",
      tags: ["Tasks"],
      security: "Bearer Token (JWT)",
      headers: {
        Authorization: "Bearer <token>",
        "Content-Type": "application/json",
      },
      queryParams: [],
      pathParams: [
        {
          name: "taskId",
          type: "string",
          required: true,
          description: "ID of the task to update",
        },
      ],
      requestBody: {
        required: true,
        contentType: "application/json",
        example: {
          title: "New task title",
          description: "Updated description",
          status: "in_progress",
          dueDate: "2024-06-01T00:00:00Z",
        },
      },
      responses: {
        "200": {
          description: "Task updated successfully",
          example: {
            id: "task_123",
            title: "New task title",
            status: "in_progress",
          },
        },
        "400": {
          description: "Invalid input",
        },
        "404": {
          description: "Task not found",
        },
      },
      codeSamples: {
        curl: 'curl -X PATCH https://api.taskmanager.com/v1/tasks/task_123 -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d \'{"status": "in_progress"}\'',
        nodejs:
          "await axios.patch('/tasks/task_123', { status: 'in_progress' }, { headers: { Authorization: `Bearer ${token}` } });",
      },
      mockServer: {
        url: "https://mock.taskmanager.com/v1/tasks/{taskId}",
        exampleResponse: {
          id: "mock_task_001",
          title: "Mock Updated Task",
          status: "in_progress",
        },
      },
      sdkAvailable: ["javascript"],
    },
  ],
};
