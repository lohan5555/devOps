node .\serveur.js


/!\ lancer docker engine avant le cluster /!\   
lancer le docker : `docker compose up --buildb`
test le back : `curl http://localhost:3000/users -UseBasicParsing`

commande minikube/kubernetes :
- `minikube start`
- `kubectl get nodes`      affiche les nœuds du cluster.
- `kubectl get pods -A`    affiche les Pods de tous les namespaces, y compris ceux du système
- `kubectl cluster-info`   affiche des informations sur le cluster

