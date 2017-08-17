# WHACK A POD MINIKUBE REFACTOR

## Original README.md

Here you can find the original repository based on google cloud [tpryan/whack_a_pod](https://github.com/tpryan/whack_a_pod) Thank you very much!

##Requirements

**Software:**

- minikube
    + Windows: `choco install minikube`
    + Linux: (v0.21) `curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.21.0/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/`
- kubectl
    + Windows: `choco install kubernetes-cli`
    + Linux (ubuntu): `sudo snap install kubectl --classic`
- make
    + Windows: `choco install make`
    + Linux: usually pre-intalled: `sudo apt-get install make`

## Initial configuration
We try not to use a local image registry so lets build images locally inside minikube node.

In this case is interesting to use the minikube's docker service. In that way the new generated images will be stored in the minikube's node.

```
> minikube start --cpus 2 --memory 8192

> export NO_PROXY=$no_proxy,$(minikube ip)

> eval $(minikube docker-env)

> docker ps

CONTAINER ID        IMAGE                                      COMMAND                  CREATED             STATUS              PORTS               NAMES
2e514ccf1b52        38bac66034a6                               "/sidecar --v=2 --..."   3 minutes ago       Up 3 minutes                            k8s_sidecar_kube-dns-910330662-vj7jp_kube-system_23cd9fcd-7dde-11e7-81ad-0800277a26e1_2
6f1b2f53e0b6        732cedac8f80                               "/bin/sh -c 'node ..."   3 minutes ago       Up 3 minutes                            k8s_hello-nodejs_hello-nodejs-2015515387-gh50r_default_b19c5ae9-7dea-11e7-b46e-0800277a26e1_1
dbe60bb3ce0f        732cedac8f80                               "/bin/sh -c 'node ..."   3 minutes ago       Up 3 minutes                            k8s_hello-nodejs_hello-nodejs-2015515387-m6cq7_default_106a0c1a-7dea-11e7-b46e-0800277a26e1_1
2d8540befb1b        f7f45b9cb733                               "/dnsmasq-nanny -v..."   3 minutes ago       Up 3 minutes                            k8s_dnsmasq_kube-dns-910330662-vj7jp_kube-system_23cd9fcd-7dde-11e7-81ad-0800277a26e1_2
05d746df2d80        732cedac8f80                               "/bin/sh -c 'node ..."   3 minutes ago       Up 3 minutes                            k8s_hello-nodejs_hello-nodejs-2015515387-4m662_default_861c5128-7deb-11e7-b46e-0800277a26e1_1
ace13059c248        a8e00546bcf3                               "/kube-dns --domai..."   3 minutes ago       Up 3 minutes                            k8s_kubedns_kube-dns-910330662-vj7jp_kube-system_23cd9fcd-7dde-11e7-81ad-0800277a26e1_2
....
....

```

> Windows OS: eval doesn't work on Windows
> 
> Set docker-env: `@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i`


## App Configuration

### Makefile.properties
Configure your current minikube-node-ip in [Makefile.properties](Makefile.properties).

You can get your minikube ip just (with minikube started) just like this:
`minikube ip`

```
CLUSTER="whack-a-pod"
MINIKUBEHOST=<minikube-node-ip>
GAMEIP=<minikube-node-ip>:30110
ADMINIP=<minikube-node-ip>:30111
APIIP=<minikube-node-ip>:30112
GAMEHOST=$(GAMEIP)
ADMINHOST=$(ADMINIP)
APIHOST=$(APIIP)

```

## Game config.js

### Windows OS
`make config` target is not supported in Windows OS so some manual configuration is needed. Edit 
`apps\game\containers\default\assets\js\config.js` and configure the minikube node ip (execute `minikube ip` to get the ip).

```
var servicehost = "<minikube-node-ip>:30112";
var adminhost = "<minikube-node-ip>:30111";

```

### Linux OS

Execute `make config`

## Build local images


Under `apps\` we can find the 3 applications (api, admin, game). Each applicaction directory has a `containers` directory that stores the docker's 'Dockerfile'.


Ensure that you reuse minikube node's docker service:
> Linux: `eval $(minikube docker-env)`
> Windows: `@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i`

Then execute build target:

`make build`

And check the list of images in kubernetes node directly from your host console:

```
> docker images

REPOSITORY                                             TAG                 IMAGE ID            CREATED             SIZE
game                                                   latest              124772af096f        3 seconds ago       441MB
admin                                                  latest              7f58c8df9975        33 seconds ago      428MB
api                                                    latest              81c22aa2bc14        3 minutes ago       428MB
gcr.io/google_appengine/php                            latest              14bc2e9d5f67        20 hours ago        428MB
hello-nodejs                                           1.0                 732cedac8f80        5 days ago          655MB
gcr.io/google_containers/k8s-dns-sidecar-amd64         1.14.4              38bac66034a6        7 weeks ago         41.8MB
gcr.io/google_containers/k8s-dns-kube-dns-amd64        1.14.4              a8e00546bcf3        7 weeks ago         49.4MB
gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64   1.14.4              f7f45b9cb733        7 weeks ago         41.4MB
gcr.io/google-containers/kube-addon-manager            v6.4-beta.2         0a951668696f        2 months ago        79.2MB
gcr.io/google_containers/kubernetes-dashboard-amd64    v1.6.1              71dfe833ce74        3 months ago        134MB
gcr.io/google_containers/kubernetes-dashboard-amd64    v1.5.1              1180413103fd        7 months ago        104MB
...
...

```

## Deploy

Execute from root project directory:

`make deploy`

Check pods and services:

`kubectl get pods -o wide`

```
NAME                                READY     STATUS    RESTARTS   AGE       IP            NODE
admin-deployment-1822891185-7x15k   1/1       Running   0          18h       172.17.0.23   minikube
api-deployment-688510802-2c8lk      1/1       Running   0          18s       172.17.0.28   minikube
api-deployment-688510802-323wp      1/1       Running   0          18s       172.17.0.13   minikube
api-deployment-688510802-6f9ht      1/1       Running   0          18s       172.17.0.19   minikube
api-deployment-688510802-7c8ng      1/1       Running   0          18s       172.17.0.15   minikube
api-deployment-688510802-9jqh2      1/1       Running   0          18s       172.17.0.16   minikube
api-deployment-688510802-bgrcp      1/1       Running   0          18s       172.17.0.26   minikube
api-deployment-688510802-fst03      1/1       Running   0          18s       172.17.0.18   minikube
api-deployment-688510802-h08fr      1/1       Running   0          18s       172.17.0.25   minikube
api-deployment-688510802-jp4qk      1/1       Running   0          18s       172.17.0.14   minikube
api-deployment-688510802-sjzrz      1/1       Running   0          18s       172.17.0.29   minikube
api-deployment-688510802-x56lz      1/1       Running   0          18s       172.17.0.22   minikube
api-deployment-688510802-zbhg8      1/1       Running   0          18s       172.17.0.21   minikube
game-deployment-2520914164-6fgfg    1/1       Running   0          18h       172.17.0.20   minikube
game-deployment-2520914164-h3h07    1/1       Running   0          18h       172.17.0.27   minikube
game-deployment-2520914164-j0zsg    1/1       Running   0          18h       172.17.0.24   minikube
game-deployment-2520914164-q7ksm    1/1       Running   0          18h       172.17.0.17   minikube
```

`kubectl get services -o wide`

```
NAME           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE       SELECTOR
admin          10.0.0.197   <nodes>       80:30111/TCP   18h       app=admin
api            10.0.0.212   <nodes>       80:30112/TCP   18h       app=api
game           10.0.0.124   <nodes>       80:30110/TCP   18h       app=game
kubernetes     10.0.0.1     <none>        443/TCP        6d        <none>

```

## Execute Game app

`minikube service game`