# robusta-task

This guide provides detailed instructions on how to deploy the TodoApp using different types of deployments such as Docker compose or Kubernetes Cluster.

## Assumputions
* Due to the lack of resources I deployed the app locally on my laptop.
* I used Docker for creating the app and Kubernetes on Docker or MiniKube for running the app on Kubernetes.
* Deployment on a single Cluster Kubernetes node. In production envrionment I would deploy the frontend in a DMZ zone and for the database and the backend I would deploy them in a separate environment which not reachable for outside user but can reach the frontend environment.
* The application consistes of frontend, backend and Database.
* I used MongoDB as a Database.
* I used NodePort Service to access the application. In a production environment I would consider using LoadBalancer Service for the frontEnd.
* I used NodePort Service to access the backend. In a production environment I would consider using ClusterIP Service for the backend.
* I ignored the storage part as the data is not important here.
* I didn't create a diagram since all my deployment is on a single node cluster

## Deployment Using Docker with docker-compose

### Step 1: Clone the Repository

Clone the TodoApp repository to your local machine.
```
$ git clone [repository URL]
$ cd robusta-task
```

### Step 2: Run the docker-compose
Run the docker-compose script inside the repository

```
$ ./docker-compose-linux-x86_64 up --build
```

### Step 3: Confirm the containers are up and running:

Confirm that you have 3 containers up and running (frontend, backend and database)

```
$ docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS          PORTS                                           NAMES
c3c4a3536d21   robusta-task-frontend   "/docker-entrypoint.…"   27 seconds ago   Up 25 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp           robusta-task-frontend-1
3ec62bab0217   robusta-task-backend    "docker-entrypoint.s…"   27 seconds ago   Up 25 seconds   0.0.0.0:3001->3000/tcp, :::3001->3000/tcp       robusta-task-backend-1
82fafa2a1b02   mongo                   "docker-entrypoint.s…"   27 seconds ago   Up 25 seconds   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   robusta-task-database-1
```

### Step 4: Access the application

The application is accessible through the url http://localhost:8080

![Frontend](./Images/image.png)

Confirm that the information is sent to the backend by using the url http://localhost:30001/todos

![Backend](./Images/backend.png)



## Deployment Using Kubernetes

### Step 1: Clone the Repository

Clone the TodoApp repository to your local machine.
```
$ git clone [repository URL]
$ cd robusta-task/todo-k8
```

### Step 2: Create the Database deployment

Inside the todo-k8 directory create the database deployment and service

```
$ kubectl create -f mongodb-deployment.yaml
$ kubectl create -f mongodb-service.yaml
```

Verify that the pod is up and running

```
$ kubectl get pod
NAME                       READY   STATUS    RESTARTS   AGE
mongodb-7dcbb4bfc9-6l7x5   1/1     Running   0          44s
```

Verify that the service is up and running

```
$ kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)     AGE
mongodb      ClusterIP   10.96.3.69   <none>        27017/TCP   45s
```

### Step 3: Create the Backend deployment

Inside the todo-k8 directory create the backend deployment and service

```
$ kubectl create -f backend-deployment.yaml
deployment.apps/todo-backend created
```

```
$ kubectl create -f backend-service.yaml
service/todo-backend created
```

Verify that the pod is up and running

```
$ kubectl get pod
NAME                            READY   STATUS    RESTARTS   AGE
mongodb-7dcbb4bfc9-6l7x5        1/1     Running   0          5m27s
todo-backend-5dbffd69b9-lhtjh   1/1     Running   0          2m41s
```

Verify that the service is up and running


```
$ kubectl get svc
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes     ClusterIP   10.96.0.1       <none>        443/TCP          69m
mongodb        ClusterIP   10.96.3.69      <none>        27017/TCP        5m34s
todo-backend   NodePort    10.105.64.129   <none>        3000:30001/TCP   2m45s
```

### Step 4: Create the Frontend deployment

Inside the todo-k8 directory create the frontend deployment and service

```
$ kubectl create -f frontend-deployment.yaml
deployment.apps/todo-frontend created
```

```
$ kubectl create -f frontend-service.yaml
service/todo-frontend created
```

Verify that the pod is up and running

```
$ kubectl get pod
NAME                             READY   STATUS    RESTARTS   AGE
mongodb-7dcbb4bfc9-6l7x5         1/1     Running   0          8m47s
todo-backend-5dbffd69b9-lhtjh    1/1     Running   0          6m1s
todo-frontend-66dd4856f7-hxmpm   1/1     Running   0          69s
```

Verify that the service is up and running

```
 kubectl get svc
NAME            TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes      ClusterIP   10.96.0.1        <none>        443/TCP          72m
mongodb         ClusterIP   10.96.3.69       <none>        27017/TCP        8m38s
todo-backend    NodePort    10.105.64.129    <none>        3000:30001/TCP   5m49s
todo-frontend   NodePort    10.107.226.111   <none>        80:30000/TCP     62s
```

### Step 5: Access the application

The frontend application is accessible on http://localhost:30000

![Frontend on K8](./Images/frontend-k8.png)

The backend application is accessible on http://localhost:30001/todos

![Backend on K8](./Images/backend-k8.png)


## Deployment Using Helm

### Step 1: Clone the Repository

Clone the TodoApp repository to your local machine.

```
$ git clone [repository URL]
$ cd robusta-task/todo-app-chart
```

### Step 2: Install the Helm Chart

Install the Helm chart using the helm install command:

```
% helm install todo-app-chart . --values values.yaml
NAME: todo-app-chart
LAST DEPLOYED: Sun Jan 14 21:36:09 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

### Step 3: Verify the pods and services are up and running

```
% kubectl get pod
NAME                                       READY   STATUS    RESTARTS   AGE
todo-app-chart-backend-5cb54bfd96-wmcpf    1/1     Running   0          13s
todo-app-chart-frontend-6d764d767b-sjr9t   1/1     Running   0          13s
todo-app-chart-mongodb-7dfb95577-kx99x     1/1     Running   0          13s
% kubectl get svc
NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes                ClusterIP   10.96.0.1        <none>        443/TCP          30h
mongodb                   ClusterIP   10.98.146.142    <none>        27017/TCP        8s
todo-app-chart-backend    NodePort    10.111.194.199   <none>        3000:30001/TCP   8s
todo-app-chart-frontend   NodePort    10.101.6.159     <none>        80:30000/TCP     8s
```


### Step 4: Access the application and test

![Helm Frontend](./Images/helm-frontend.png)

![Helm Backend](./Images/helm-backend.png)


## CI/CD Configuration

I didn't have time to fully test the CI/CD but I did the configuration using Bamboo CI/CD. The steps I followed are:

* Install Bamboo CI/CD
* Create a Project and a Plan
* Create linked repository that will link my repository on Github using Github account
* In the plan configuration. I have single stage that has one Job and this Job consistes of multiple tasks
* The first task will be the Source Code Checkout task ![Source Code Checkout task](./Images/scc.png)
* Second task will be a script task to loging to my docker hub ![Script task](./Images/script.png)
* Third task will be a docker task that is responsible for building the image and pushing it to the repository
* Attached the CI-CD-config.yaml file for more information

I tried playing with Gitlab but I didn't get anywhere but :) 


## Issues faced during the project:

* Due to lack of resources and using single node cluster. I faced problem accessing my app throught the web. To overcome this I had to use the localhost address
* Firewall was dropping connection to the fronend application. To overcome this I had to allow the port 30001
* There were some connection error between the backend and the database. To overcome this I added in code a troubleshooting line to print if the database connection was successfull or not and had to test connection by myself to verify that the backend can connect to the database
* Couple of syntax error during the creation of helm chart since I separated the deployment of the frontend and backend and database so I had to separate the deployemnt and service templates
