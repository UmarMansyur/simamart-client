<template>
  <div class="container">
    <div class="row">
      <div class="col-12 mt-5">
        <h1 class="text-center">BHERUNG KAMPOENG</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 mb-2">
        <div class="row justify-content-start mt-4">
          <div class="col-lg-10 mb-2 text-center">
            <div class="input-group rounded">
              <input type="text" class="form-control" placeholder="Cari Barang" v-model="query" @change="changeSearch"/>
              <button class="btn btn-primary" id="search-addon" @click="changeSearch">
                <i class="bi bi-search"></i>
              </button>
              <RouterLink to="/" class="btn btn-light" id="search-addon">
                <i class="bi bi-gear"></i>
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="col-lg-3"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-7 mb-3">
        <div class="col-12 mb-2">
          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead class="align-middle">
                <tr>
                  <th>
                    Nama Barang
                  </th>
                  <th class="text-end" style="width: 30%;">Harga Barang</th>
                  <th style="width: 25%;">Jumlah</th>
                  <th class="text-center">#</th>
                </tr>
              </thead>
              <tbody class="align-middle">
                <tr v-for="i in result" :key="i.id">
                  <td class="align-middle">{{ i.nama_barang }}</td>
                  <td class="text-end">{{ new Intl.NumberFormat('id-ID', {
                    style: 'currency', currency: 'IDR'
                  }).format(i.harga_jual).slice(0, -3) }}</td>
                  <td>
                    <input type="text" class="form-control" id="quantity" min="0" v-model="jumlah[i.id]"
                      @keyup="convertToRp(i.id)" />
                  </td>
                  <td class="text-center">
                    <button type="button" class="btn btn-info" @click="addToCart(i)">
                      <i class="bi bi-cart-plus"></i> <span class="d-none d-md-inline-block">Tambah</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination :current-page="currentPage" :is-first-page="isFirstPage" :is-last-page="isLastPage"
              :go-to="goToPage" :next-page="nextPage" :page-list="pageList" :total-page="totalPage" :prev-page="prevPage"
              :total-data="totalData" v-if="result.length > 0" />
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <table class="table table-hover table-borderless table-sm py-2">
                  <tbody class="align-middle">
                    <tr>
                      <td colspan="5">
                        <h5 class="text-center pt-2">Keranjang</h5>
                      </td>
                    </tr>
                    <tr class="table-danger" v-for="item in cart" :key="item.id">
                      <th class="text-center">
                        <div class="form-check form-switch form-switch-md">
                          <input type="checkbox" class="form-check-input" id="barang-check" v-model="item.checked"
                            @change="check"> <label class="form-check-label" for="barang-check"></label>
                        </div>
                      </th>
                      <td style="font-size: 90%;">
                        {{ item.nama_barang }}
                      </td>
                      <td style="font-size: 90%;">
                        {{ item.jumlah.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}
                      </td>
                      <td class="text-end" style="font-size: 90%;">
                        {{ new Intl.NumberFormat('id-ID', {
                          style: 'currency', currency: 'IDR'
                        }).format(item.harga_jual).slice(0, -3) }}
                      </td>
                      <td class="text-end" style="font-size: 90%;">
                        {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total_harga).slice(0, -3) }}
                      </td>

                    </tr>
                    <tr>
                      <td colspan="2" class="text-center">
                        <div class="form-check form-switch form-switch-md">
                          <input type="checkbox" class="form-check-input" id="is-checked" v-model="isChecked"> <small
                            style="font-size: 12px;">Tandai Semua</small>
                        </div>
                      </td>
                      <td colspan="2">
                        <h6 class="text-end">Total</h6>
                      </td>
                      <td class="text-end">
                        <h6>{{ new Intl.NumberFormat('id-ID', {
                          style: 'currency', currency: 'IDR'
                        }).format(total).slice(0, -3) }}</h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-12 mb-3">
                <div class="row mb-4">
                  <label for="horizontal-firstname-input" class="col-4 col-form-label text-dark">Bayar: </label>
                  <div class="col-8">
                    <input type="text" class="form-control text-end" id="horizontal-firstname-input" v-model="bayar"
                      @keyup="cekKembalian()" />
                  </div>
                </div>
                <div class="row mb-4">
                  <label for="horizontal-firstname-input" class="col-4 col-form-label text-dark">Kembalian: </label>
                  <div class="col-8">
                    <input type="text" class="form-control text-end" id="horizontal-firstname-input" readonly v-model="kembalian" />
                  </div>
                </div>

              </div>
              <div class="col-12 text-center">
                <button class="btn mb-4 btn-danger me-2" @click="destroy">
                  <i class="bi bi-trash"></i> Hapus
                </button>
                <button class="btn mb-4 btn-success" @click="dibayar" :disabled="!meta.valid">
                  <i class="bi bi-cart-check"></i> Bayar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="navbar shadow navbar-expand-lg navbar-light bg-light fixed-bottom">
    <div class="container pt-1 pb-1 text-dark">
      <p class="mx-auto mb-0 ">2023 - &copy; Al-Ghazali</p>
    </div>
  </footer>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import usePagination from "../composables/pagination";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import useApi from "../composables/api";
import Notify from "../helpers/notify";
const query = ref('');
const {
  result,
  totalData,
  currentPage,
  totalPage,
  pageList,
  isFirstPage,
  isLastPage,
  nextPage,
  prevPage,
  goToPage,
  fetchData,
  search
} = usePagination("/barang", '', query);

onMounted(() => {
  fetchData();
});

const jumlah = ref<string[]>([]);
const cart = ref<any[]>([]);
const addToCart = (item: any) => {
  jumlah.value[item.id] = jumlah.value[item.id].replace(/\D/g, "");
  const exist = cart.value.find((i) => i.id === item.id);
  if (exist) {
    exist.jumlah = parseInt(exist.jumlah) + parseInt(jumlah.value[item.id]);
    exist.total_harga = exist.harga_jual * exist.jumlah;
  } else {
    cart.value.push({
      id: item.id,
      checked: true,
      nama_barang: item.nama_barang,
      harga_beli: item.harga_beli,
      harga_jual: item.harga_jual,
      jumlah: jumlah.value[item.id],
      total_harga: item.harga_jual * Number(jumlah.value[item.id]),
    });
  }
  check();
  total.value = cart.value.filter((i) => i.checked === true).reduce((a, b) => a + (b['harga_jual'] * b['jumlah'] || 0), 0);
  jumlah.value[item.id] = "";
};

const convertToRp = (id: number) => {
  jumlah.value[id] = jumlah.value[id].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const destroy = () => {
  const exist = cart.value.find((i) => i.checked === true);
  if (exist) {
    cart.value = cart.value.filter((i) => i.checked === false);
  }
};

const isChecked = ref<boolean>(false);

watch(isChecked, (value) => {
  if (value) {
    cart.value.forEach((item) => {
      item.checked = true;
    });
    return;
  }
});

const total = ref<number>(0);
const check = () => {
  const exist = cart.value.find((i) => i.checked === false);
  total.value = cart.value.filter((i) => i.checked === true).reduce((a, b) => a + (b['harga_jual'] * b['jumlah'] || 0), 0);
  if (exist) {
    isChecked.value = false;
  } else {
    isChecked.value = true;
  }
  cekKembalian();
};

const schema = yup.object().shape({
  bayar: yup.string().required(),
  kembalian: yup.string().required(),
});

const { meta } = useForm({
  validationSchema: schema,
  initialValues: {
    bayar: "",
    kembalian: "",
  },
});

const { value: bayar } = useField<string>("bayar");
const { value: kembalian } = useField<string>("kembalian");
const { postResource } = useApi();
const dibayar = async () => {
  const data = {
    kode_transaksi: "TRX-" + Date.now(),
    total_harga: total.value,
    bayar: bayar.value.replace(/\D/g, ""),
    kembalian: kembalian.value.replace(/\D/g, ""),
    detail_transaksi: cart.value.filter((i) => i.checked === true).map((i) => {
      return {
        barang_id: i.id,
        jumlah: i.jumlah,
        harga_beli: i.harga_jual,
        harga_jual: i.harga_jual,
        total_harga: i.total_harga,
      };
    }),
  }

  const response = await postResource("/detail-transaksi", data);
  if(response) {
    cart.value = [];
    total.value = 0;
    bayar.value = "";
    kembalian.value = "";
    jumlah.value = [];
    isChecked.value = false;
    Notify.success("Transaksi Berhasil");
  }
}

function cekKembalian() {
  kembalian.value = (Number(bayar.value.replace(/\D/g, "")) - total.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const changeSearch = async () => {
  console.log('change search');
  await search();
}
</script>

