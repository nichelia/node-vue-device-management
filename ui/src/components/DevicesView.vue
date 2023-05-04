<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">

      <!-- NEW/EDIT DIALOG -->
      <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-text-field
                      v-model="editedDevice.brand"
                      :rules="requiredField"
                      label="Brand"
                      required
                    >
                      <template #label>
                        <span><strong>* </strong></span>Brand
                      </template>
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedDevice.model"
                      :rules="requiredField"
                      label="Model"
                      required
                    >
                      <template #label>
                        <span><strong>* </strong></span>Model
                      </template>
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedDevice.os"
                      label="OS"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedDevice.release_date"
                      label="Release Date"
                      :rules="releaseDateRule"
                    ></v-text-field>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

      <!-- DELETE DIALOG -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DATA TABLE -->
      <v-card>
        <v-card-title>
          <span class="headline">Devices</span>
        </v-card-title>
        <v-text-field v-model="search" label="Search" outlined dense append-icon="mdi-magnify"></v-text-field>
        <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="id"
        :search="search"
        :server-items-length="totalItems"
        :server-items="serverItems"
        :sort-by="[{ key: 'os', order: 'asc' }]"
        @update:options="loadItems"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              size="small"
              class="me-2"
              @click="editDevice(item.raw)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              color="red"
              @click="deleteDevice(item.raw)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            prepend-icon="mdi-plus"
            variant="outlined"
            color="primary"
            @click="editDevice()"
          >
            Add Device
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import DevicesAPI from '@/api/DevicesAPI';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: 'Brand', key: 'brand', sortable: false },
      { title: 'Model', key: 'model', sortable: false },
      { title: 'OS', key: 'os' },
      { title: 'Release Date', key: 'release_date' , sortable: false},
      { title: 'Action', key: 'actions', sortable: false },
    ],
    items: [],
    editedIndex: -1,
    editedDevice: {
      brand: '',
      model: '',
      os: '',
      release_date: '',
    },
    defaultDevice: {
      brand: '',
      model: '',
      os: '',
      release_date: '',
    },
    serverItems: [],
    loading: true,
    totalItems: 0,
    search: '',
    rules: {
      required: (value) => !!value || "Required.",
      releaseDateRule: (value) => !value || /^\d{4}\/(0?[1-9]|1[0-2])$/.test(value) || 'Release Date must be in the format YYYY/MM and a valid month'
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Device' : 'Edit Device'
    },
    releaseDateRule () {
      return [
        this.rules.releaseDateRule
      ]
    },
    requiredField () {
      return [
        this.rules.required
      ]
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },


  created() {
    this.loadItems();
  },

  methods: {
    clear () {
      this.$nextTick(() => {
        this.editedDevice = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async loadItems() {
      this.loading = true;
      try {
        const items = await DevicesAPI.fetch();
        this.serverItems = items;
        this.totalItems = items.length;
        this.items = items.slice(0, this.size);
        this.loading = false;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    editDevice(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedDevice = Object.assign({}, item)
      this.dialog = true
    },

    async addRemoteDevice() {
      try {
        await DevicesAPI.create(this.editedDevice);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async editRemoteDevice () {
      try {
        this.objId = this.editedDevice.id
        delete this.editedDevice["id"]
        await DevicesAPI.update(this.objId, this.editedDevice);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async save () {
      this.formValidation = await this.$refs.form.validate()
      if (!this.formValidation.valid) {
        return
      }

      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedDevice)
        await this.editRemoteDevice()
      } else {
        this.items.push(this.editedDevice)
        await this.addRemoteDevice()
      }
      this.close()
    },

    close () {
      this.dialog = false
      this.clear()
    },

    async deleteDevice (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedDevice = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.items.splice(this.editedIndex, 1)
      await this.deleteRemoteDevice()
      this.closeDelete()
    },

    async deleteRemoteDevice () {
      try {
        await DevicesAPI.delete(this.editedDevice.id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    closeDelete () {
      this.dialogDelete = false
      this.clear()
    }
  }
}
</script>
