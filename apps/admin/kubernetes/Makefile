# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
ifeq ($(OS),Windows_NT)
	BASEDIR = $(shell cd)
else
	BASEDIR = $(shell pwd)
endif

include ../../../Makefile.properties

reset: clean.deployment app
	say "App Reset"

app: build deploy

build: creds
	$(info Local docker build using minikube docker-env env vars: TODO)
	docker build --rm -t admin "$(BASEDIR)/../containers/."

deploy: creds
	kubectl apply -f "$(BASEDIR)/admin-service.yaml"
	kubectl apply -f "$(BASEDIR)/admin-deployment.yaml"	

clean: clean.deployment clean.service 

clean.deployment: env
	-kubectl delete -f "$(BASEDIR)/admin-deployment.yaml"
	
clean.service: env
	-kubectl delete -f "$(BASEDIR)/admin-service.yaml"

retry: clean build deploy

config:
	@echo Creating ADMIN Yaml files based on samples and setting in your Makefile.properties
	$(info NO need for creating yaml files with minikube configuration)
	$(info NO need for creating containers/default/api/k8s/createdeploy/deployment.json)
	

define rewritefile
	@sed s/$(2)/$(3)/g <""$(1)"" >"$(BASEDIR)/.temp"
	@cp "$(BASEDIR)/.temp" $(1)
	@rm "$(BASEDIR)/.temp" 
endef