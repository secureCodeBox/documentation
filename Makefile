# SPDX-FileCopyrightText: the secureCodeBox authors
#
# SPDX-License-Identifier: Apache-2.0

PROJECT_DIR	= $(shell pwd)
DIAGRAMS		:= $(shell find $(PROJECT_DIR) -type f -name '*.puml')
IMAGES			:= $(addsuffix .png, $(basename $(DIAGRAMS)))

all: help

.PHONY: puml
puml: $(IMAGES) ## Generate PlantUML images

%.png: %.puml
	plantuml -tpng $^

.PHONY: help
help: ## Display this help screen.
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

