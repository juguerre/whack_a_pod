# WHACK A POD MINIKUBE REFACTOR

## Original README.md

Here you can find the original repository based on google cloud [tpryan/whack_a_pod](https://github.com/tpryan/whack_a_pod) Thank you very much!

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


## App Configuration

### Makefile.properties


## Build local images


Under `apps\` we can find the 3 applications (api, admin, game). Each applicaction directory has a `containers` directory that stores the docker's 'Dockerfile'.

On apps/api/containers execute:
`docker build --rm -t api .`

On apps/admin/containers execute:
`docker build --rm -t admin .`

On apps/api/containers execute:
`docker build --rm -t game .`

And check the list of images in kubernetes node:

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